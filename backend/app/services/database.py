import base64
import hashlib
import hmac
import json
import os
import sqlite3
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parents[2]
DB_PATH = BASE_DIR / "bpis.db"

DEFAULT_SCHEMES = [
    {
        "name": "Ayushman Bharat Health Protection Mission",
        "category": "Health",
        "description": "Extends financial protection for secondary and tertiary care to vulnerable households in high-need districts.",
        "eligibility": "Low-income households, vulnerable families, and residents identified through district deprivation indicators.",
        "working_process": "State health agencies empanel hospitals, validate beneficiaries, process admissions, and reimburse care through a claims workflow.",
        "target_districts": ["Bahraich", "Shrawasti", "Balrampur", "Sitamarhi", "Kishanganj", "Dhubri"],
    },
    {
        "name": "Samagra Shiksha Abhiyan",
        "category": "Education",
        "description": "Supports school infrastructure, teacher capacity, and inclusive learning interventions in underserved districts.",
        "eligibility": "Government schools and children in districts with low literacy, poor retention, or infrastructure gaps.",
        "working_process": "District education plans identify gaps, states release funds, and local bodies execute classroom, teacher, and remedial learning interventions.",
        "target_districts": ["Kishanganj", "Mewat", "Bahraich", "Araria", "Katihar", "Pakur"],
    },
    {
        "name": "Poshan Abhiyan",
        "category": "Nutrition",
        "description": "Coordinates nutrition delivery for women, children, and adolescent girls through convergence across frontline departments.",
        "eligibility": "Pregnant women, lactating mothers, children, and adolescent girls in malnutrition-prone districts.",
        "working_process": "Anganwadi workers track beneficiaries, run growth monitoring, and coordinate take-home nutrition, counselling, and referrals.",
        "target_districts": ["Malkangiri", "Nabarangapur", "Koraput", "Dahod", "Barwani", "Dindori"],
    },
    {
        "name": "Jal Jeevan Mission",
        "category": "Infrastructure",
        "description": "Improves rural household tap water coverage and water quality in water-stressed or underserved geographies.",
        "eligibility": "Rural households lacking functional tap connections and districts facing water access or quality challenges.",
        "working_process": "Village action plans prioritize habitations, implement last-mile connections, and monitor service delivery through local committees.",
        "target_districts": ["Barmer", "Jaisalmer", "Kalahandi", "Nuapada", "Gadchiroli", "Nandurbar"],
    },
    {
        "name": "PM Kaushal Vikas Yojana",
        "category": "Employment",
        "description": "Provides short-term skill training aligned with local industry and livelihood needs in emerging labour markets.",
        "eligibility": "Youth, jobseekers, and informal workers needing market-aligned skilling support.",
        "working_process": "Training partners mobilize candidates, deliver certified modules, assess competencies, and link graduates to placement support.",
        "target_districts": ["Gaya", "Muzaffarpur", "Nagaur", "Purulia", "Dhar", "Banswara"],
    },
    {
        "name": "National Health Mission",
        "category": "Health",
        "description": "Strengthens primary health systems, community outreach, and maternal-child care where service gaps remain severe.",
        "eligibility": "Districts with high disease burden, weak primary care access, or maternal and child health deficits.",
        "working_process": "Flexible district plans fund human resources, outreach, facilities, diagnostics, and monitoring through state health missions.",
        "target_districts": ["Dantewada", "Bijapur", "Nandurbar", "Palamu", "Latehar", "Barpeta"],
    },
]

DEFAULT_USERS = [
    {"username": "admin", "password": "BPISAdmin@2026"},
    {"username": "analyst", "password": "BPISAnalyst@2026"},
]


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def hash_password(password: str, salt: bytes | None = None) -> str:
    actual_salt = salt or os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), actual_salt, 100000)
    return f"{base64.b64encode(actual_salt).decode()}${base64.b64encode(password_hash).decode()}"


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        salt_b64, hash_b64 = hashed_password.split("$", 1)
        salt = base64.b64decode(salt_b64.encode())
        expected_hash = base64.b64decode(hash_b64.encode())
    except ValueError:
        return False

    candidate_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return hmac.compare_digest(candidate_hash, expected_hash)


def init_db() -> None:
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS schemes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            eligibility TEXT NOT NULL,
            working_process TEXT NOT NULL,
            target_districts TEXT NOT NULL DEFAULT '[]'
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            hashed_password TEXT NOT NULL
        )
        """
    )

    scheme_count = cursor.execute("SELECT COUNT(*) FROM schemes").fetchone()[0]
    if scheme_count == 0:
        cursor.executemany(
            """
            INSERT INTO schemes (name, category, description, eligibility, working_process, target_districts)
            VALUES (:name, :category, :description, :eligibility, :working_process, :target_districts)
            """,
            [
                {
                    **scheme,
                    "target_districts": json.dumps(scheme["target_districts"]),
                }
                for scheme in DEFAULT_SCHEMES
            ],
        )

    user_count = cursor.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    if user_count == 0:
        cursor.executemany(
            "INSERT INTO users (username, hashed_password) VALUES (:username, :hashed_password)",
            [
                {
                    "username": user["username"],
                    "hashed_password": hash_password(user["password"]),
                }
                for user in DEFAULT_USERS
            ],
        )

    connection.commit()
    connection.close()


def _row_to_scheme(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "name": row["name"],
        "category": row["category"],
        "description": row["description"],
        "eligibility": row["eligibility"],
        "working_process": row["working_process"],
        "target_districts": json.loads(row["target_districts"] or "[]"),
    }


def get_all_schemes() -> list[dict[str, Any]]:
    connection = get_connection()
    rows = connection.execute(
        """
        SELECT id, name, category, description, eligibility, working_process, target_districts
        FROM schemes
        ORDER BY name ASC
        """
    ).fetchall()
    connection.close()
    return [_row_to_scheme(row) for row in rows]


def search_schemes(query: str) -> list[dict[str, Any]]:
    connection = get_connection()
    like_query = f"%{query.strip()}%"
    rows = connection.execute(
        """
        SELECT id, name, category, description, eligibility, working_process, target_districts
        FROM schemes
        WHERE name LIKE ? COLLATE NOCASE OR category LIKE ? COLLATE NOCASE
        ORDER BY name ASC
        """,
        (like_query, like_query),
    ).fetchall()
    connection.close()
    return [_row_to_scheme(row) for row in rows]


def authenticate_user(username: str, password: str) -> dict[str, Any] | None:
    connection = get_connection()
    row = connection.execute(
        "SELECT id, username, hashed_password FROM users WHERE username = ?",
        (username.strip(),),
    ).fetchone()
    connection.close()

    if row is None or not verify_password(password, row["hashed_password"]):
        return None

    return {"id": row["id"], "username": row["username"]}
