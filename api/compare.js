import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseFollowers(data) {
  return new Set(
    data
      .filter((i) => i.string_list_data?.[0]?.value)
      .map((i) => i.string_list_data[0].value.trim())
  );
}

function parseFollowing(data) {
  const items = Array.isArray(data) ? data : data.relationships_following || [];
  return new Set(
    items
      .map((i) => i.title || i.string_list_data?.[0]?.value || "")
      .map((v) => v.trim())
      .filter(Boolean)
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const form = formidable({ multiples: true, maxFileSize: 20 * 1024 * 1024 });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Error al parsear el formulario: " + err.message });

    try {
      const followersFile = Array.isArray(files.followers) ? files.followers[0] : files.followers;
      const followingFile = Array.isArray(files.following) ? files.following[0] : files.following;

      if (!followersFile || !followingFile) {
        return res.status(400).json({ error: "Se requieren ambos archivos." });
      }

      const followersData = JSON.parse(fs.readFileSync(followersFile.filepath, "utf-8"));
      const followingData = JSON.parse(fs.readFileSync(followingFile.filepath, "utf-8"));

      const setFollowers = parseFollowers(followersData);
      const setFollowing = parseFollowing(followingData);

      const results = [];
      setFollowing.forEach((u) => {
        results.push({ username: u, status: setFollowers.has(u) ? "mutual" : "not_following_back" });
      });
      setFollowers.forEach((u) => {
        if (!setFollowing.has(u)) results.push({ username: u, status: "not_followed_back" });
      });

      results.sort((a, b) => a.status.localeCompare(b.status) || a.username.localeCompare(b.username));

      res.status(200).json({
        results,
        summary: {
          notFollowingBack: results.filter((r) => r.status === "not_following_back").length,
          notFollowedBack: results.filter((r) => r.status === "not_followed_back").length,
          mutual: results.filter((r) => r.status === "mutual").length,
          total: results.length,
        },
      });
    } catch (e) {
      res.status(500).json({ error: "Error al procesar: " + e.message });
    }
  });
}
