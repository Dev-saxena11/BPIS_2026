import { useEffect, useState } from "react";
import { MessageSquarePlus, NotebookText, Tag } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { createDistrictNote, getDistrictNotes, getPriorityRanking } from "../services/api";
import { getLocalizedDistrictName } from "../utils/districtLocalization";

const defaultForm = {
  author_name: "",
  comment: "",
  tag: "meeting",
  action_item: "",
};

export default function DistrictNotesPanel() {
  const { t } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPriorityRanking().then((data) => {
      setDistricts(data || []);
    });
  }, []);

  useEffect(() => {
    if (!selectedDistrict) return;
    setLoading(true);
    getDistrictNotes(selectedDistrict)
      .then((response) => {
        setNotes(response?.notes || []);
      })
      .finally(() => setLoading(false));
  }, [selectedDistrict]);

  const submitNote = async (event) => {
    event.preventDefault();
    setStatus("");

    if (!selectedDistrict) {
      setStatus("Choose a district first.");
      return;
    }

    try {
      await createDistrictNote({
        district: selectedDistrict,
        author_name: form.author_name,
        comment: form.comment,
        tag: form.tag,
        action_item: form.action_item,
      });
      setForm(defaultForm);
      const refreshed = await getDistrictNotes(selectedDistrict);
      setNotes(refreshed?.notes || []);
      setStatus("Note saved.");
    } catch (error) {
      setStatus(error?.response?.data?.detail || "Could not save note.");
    }
  };

  return (
    <div className="gov-card" style={{ background: "white", marginBottom: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h2 className="gov-heading" style={{ margin: 0 }}>
            Notes and collaboration
          </h2>
          <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>
            Attach comments, tags, and action items to a district so teams can work from one shared record.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ea580c", fontWeight: 700 }}>
          <NotebookText size={18} />
          Shared district log
        </div>
      </div>

      <form onSubmit={submitNote} style={{ display: "grid", gap: "14px", marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>District</label>
            <input
              list="district-note-options"
              value={selectedDistrict}
              onChange={(event) => setSelectedDistrict(event.target.value)}
              placeholder="Type a district name"
              style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 14px", boxSizing: "border-box" }}
            />
            <datalist id="district-note-options">
              {districts.map((district) => (
                <option key={district.district} value={district.district}>
                  {getLocalizedDistrictName(t, district.district)}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>Author</label>
            <input
              value={form.author_name}
              onChange={(event) => setForm((current) => ({ ...current, author_name: event.target.value }))}
              placeholder="Officer name"
              style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 14px", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>Tag</label>
            <select
              value={form.tag}
              onChange={(event) => setForm((current) => ({ ...current, tag: event.target.value }))}
              style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 14px", boxSizing: "border-box", background: "white" }}
            >
              <option value="meeting">meeting</option>
              <option value="risk">risk</option>
              <option value="follow-up">follow-up</option>
              <option value="action-item">action-item</option>
              <option value="observation">observation</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>Action item</label>
            <input
              value={form.action_item}
              onChange={(event) => setForm((current) => ({ ...current, action_item: event.target.value }))}
              placeholder="Next step for the team"
              style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 14px", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>Comment</label>
          <textarea
            value={form.comment}
            onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
            rows={4}
            placeholder="Write a short note about the district..."
            style={{ width: "100%", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "12px 14px", boxSizing: "border-box", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="submit"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "none", background: "#0f172a", color: "white", fontWeight: 800, borderRadius: "12px", padding: "12px 16px", cursor: "pointer" }}
          >
            <MessageSquarePlus size={18} />
            Save note
          </button>
          {status && <span style={{ color: "#475569" }}>{status}</span>}
        </div>
      </form>

      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ margin: 0, color: "#0f172a" }}>
            Notes for {selectedDistrict ? getLocalizedDistrictName(t, selectedDistrict) : "selected district"}
          </h3>
          {loading && <span style={{ color: "#64748b" }}>Loading...</span>}
        </div>

        {notes.length ? (
          <div style={{ display: "grid", gap: "12px" }}>
            {notes.map((note) => (
              <div key={note.id} style={{ borderRadius: "16px", border: "1px solid #e2e8f0", padding: "16px", background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 800, color: "#0f172a" }}>{note.author_name}</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ background: "#ffedd5", color: "#c2410c", borderRadius: "999px", padding: "5px 10px", fontSize: "0.8rem", fontWeight: 800 }}>
                      <Tag size={12} style={{ display: "inline", marginRight: "5px" }} />
                      {note.tag}
                    </span>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{new Date(note.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ color: "#334155", lineHeight: 1.7, marginBottom: "8px" }}>{note.comment}</div>
                {note.action_item ? (
                  <div style={{ color: "#0f172a", fontWeight: 700 }}>
                    Action item: <span style={{ color: "#475569", fontWeight: 500 }}>{note.action_item}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ borderRadius: "16px", border: "1px dashed #cbd5e1", padding: "20px", color: "#64748b" }}>
            No notes yet for this district.
          </div>
        )}
      </div>
    </div>
  );
}
