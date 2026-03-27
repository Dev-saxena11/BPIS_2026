export const getLocalizedDistrictName = (t, districtName) => {
  if (typeof districtName !== "string") return "";

  const rawName = districtName.trim();
  if (!rawName) return "";

  const districtMap = typeof t === "function" ? t("districtNameMap") : null;
  const normalizedKey = rawName.toLowerCase();

  if (
    districtMap &&
    typeof districtMap === "object" &&
    !Array.isArray(districtMap) &&
    typeof districtMap[normalizedKey] === "string" &&
    districtMap[normalizedKey].trim()
  ) {
    return districtMap[normalizedKey];
  }

  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
};
