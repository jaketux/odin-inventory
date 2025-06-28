const pool = require("./pool");

async function getAllCards() {
  const { rows } = await pool.query(
    "SELECT cards.id as card_id, cards.cardname as card_name, cards.carddescription as carddescription, cards.cardimg as cardimg, raritylevels.id as rarity_level_id, raritylevels.raritylevel as rarity_level, genres.id as genre_id_ref, genres.genre as genre_name, editions.id as edition_id_ref, editions.edition as edition_name FROM cards JOIN raritylevels ON cards.rarity_id = raritylevels.id JOIN genres ON cards.genre_id = genres.id JOIN editions ON cards.edition_id = editions.id"
  );
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getAllEditions() {
  const { rows } = await pool.query("SELECT * FROM editions");
  return rows;
}

async function getAllRaritys() {
  const { rows } = await pool.query("SELECT * FROM raritylevels");
  return rows;
}

async function getByGenre(genre) {
  const { rows } = await pool.query(
    "SELECT cards.id as card_id, cards.cardname as card_name, cards.carddescription as carddescription, cards.cardimg as cardimg, raritylevels.id as rarity_level_id, raritylevels.raritylevel as rarity_level, genres.id as genre_id_ref, genres.genre as genre_name, editions.id as edition_id_ref, editions.edition as edition_name FROM cards JOIN raritylevels ON cards.rarity_id = raritylevels.id JOIN genres ON cards.genre_id = genres.id JOIN editions ON cards.edition_id = editions.id WHERE genre_id = $1",
    [genre]
  );
  return rows;
}

async function getByEdition(edition) {
  const { rows } = await pool.query(
    "SELECT cards.id as card_id, cards.cardname as card_name, cards.carddescription as carddescription, cards.cardimg as cardimg, raritylevels.id as rarity_level_id, raritylevels.raritylevel as rarity_level, genres.id as genre_id_ref, genres.genre as genre_name, editions.id as edition_id_ref, editions.edition as edition_name FROM cards JOIN raritylevels ON cards.rarity_id = raritylevels.id JOIN genres ON cards.genre_id = genres.id JOIN editions ON cards.edition_id = editions.id WHERE edition_id = $1",
    [edition]
  );
  return rows;
}

async function getByRarity(rarity) {
  const { rows } = await pool.query(
    "SELECT cards.id as card_id, cards.cardname as card_name, cards.carddescription as carddescription, cards.cardimg as cardimg, raritylevels.id as rarity_level_id, raritylevels.raritylevel as rarity_level, genres.id as genre_id_ref, genres.genre as genre_name, editions.id as edition_id_ref, editions.edition as edition_name FROM cards JOIN raritylevels ON cards.rarity_id = raritylevels.id JOIN genres ON cards.genre_id = genres.id JOIN editions ON cards.edition_id = editions.id WHERE rarity_id = $1",
    [rarity]
  );
  return rows;
}

async function updateGenreName(genre, genreid) {
  await pool.query("UPDATE genres SET genre = $1 WHERE id = $2", [
    genre,
    genreid,
  ]);
}

async function updateEditionName(edition, editionid) {
  await pool.query("UPDATE editions SET edition = $1 WHERE id = $2", [
    edition,
    editionid,
  ]);
}

async function updateCard(id, cardname, description, rarity, genre, edition) {
  await pool.query(
    "UPDATE cards SET cardname = $1, carddescription = $2, rarity_id = $3, genre_id = $4, edition_id = $5 WHERE id = $6",
    [cardname, description, rarity, genre, edition, id]
  );
}

async function createCard(
  cardname,
  rarity,
  genre,
  edition,
  description,
  cardimg
) {
  await pool.query(
    "INSERT INTO cards (cardname, rarity_id, genre_id, edition_id, carddescription, cardimg) VALUES ($1, $2, $3, $4, $5, $6)",
    [cardname, rarity, genre, edition, description, cardimg]
  );
}

async function createGenre(genrename) {
  await pool.query("INSERT INTO genres (genre) VALUES ($1)", [genrename]);
}

async function createEdition(editionname) {
  await pool.query("INSERT INTO editions (edition) VALUES ($1)", [editionname]);
}

async function deleteCard(cardid) {
  await pool.query("DELETE FROM cards WHERE cards.id = $1", [cardid]);
}

async function deleteGenre(genreid) {
  await pool.query("DELETE FROM genres WHERE genres.id = $1", [genreid]);
}

async function deleteEdition(editionid) {
  await pool.query("DELETE FROM editions WHERE editions.id = $1", [editionid]);
}

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const { rows } = await pool.query("SELECT NOW() as current_time");
    console.log("Database connection successful:", rows[0]);

    // Test if tables exist
    const { rows: tables } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(
      "Available tables:",
      tables.map((t) => t.table_name)
    );
  } catch (error) {
    console.error("Database connection test failed:", error.message);
  }
}

testConnection();

module.exports = {
  getAllCards,
  getAllGenres,
  getAllEditions,
  getAllRaritys,
  getByGenre,
  getByEdition,
  getByRarity,
  updateGenreName,
  updateEditionName,
  updateCard,
  createCard,
  createGenre,
  createEdition,
  deleteCard,
  deleteGenre,
  deleteEdition,
};
