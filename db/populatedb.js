require("dotenv").config();

const environment = process.env.NODE_ENV || "development";

const { Client } = require("pg");

const SQL = `

CREATE TABLE IF NOT EXISTS cards (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
cardname VARCHAR ( 255 )
);

INSERT INTO cards (cardname)
VALUES ('Cloud'),('Aerith'),('Sephiroth'),('Andrew Johns'),('Matthew Johns'),('Jon Jones');

ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS rarity_id INT,
ADD COLUMN IF NOT EXISTS genre_id INT,
ADD COLUMN IF NOT EXISTS edition_id INT,
ADD COLUMN IF NOT EXISTS carddescription VARCHAR,
ADD COLUMN IF NOT EXISTS cardimg VARCHAR;


CREATE TABLE IF NOT EXISTS raritylevels (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
raritylevel VARCHAR ( 255 )
);

INSERT INTO raritylevels (raritylevel)
VALUES ('Mythic'),('Rare'),('Uncommon'),('Common');

CREATE TABLE IF NOT EXISTS genres (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
genre VARCHAR ( 255 )
);

INSERT INTO genres (genre) 
VALUES ('Magic the Gathering: Final Fantasy'),('NRL Traders'),('UFC Topps');

CREATE TABLE IF NOT EXISTS editions (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
edition VARCHAR ( 255 )
);

INSERT INTO editions (edition)
VALUES ('Signature Series'),('Standard'),('Foil'),('Borderless');

ALTER TABLE cards
ADD CONSTRAINT card_rarity_id_fkey
FOREIGN KEY (rarity_id)
REFERENCES raritylevels (id);

ALTER TABLE cards
ADD CONSTRAINT card_genre_id_fkey
FOREIGN KEY (genre_id)
REFERENCES genres (id);

ALTER TABLE cards
ADD CONSTRAINT card_edition_id_fkey
FOREIGN KEY (edition_id)
REFERENCES editions (id);

UPDATE cards SET cardimg = 'https://static1.thegamerimages.com/wordpress/wp-content/uploads/2020/05/ff7-braver.jpg', carddescription = 'Cloud using the Braver Limit Break', rarity_id = 1, genre_id = 1, edition_id = 4 WHERE id = 1;
UPDATE cards SET cardimg = 'https://imgix.bustle.com/uploads/image/2024/3/4/90b1c5c3-d9e7-4902-9380-859ddbc7ba6c-ff7aerith.jpg', carddescription = 'Aerith summoning Holy', rarity_id = 1, genre_id = 1, edition_id = 4 WHERE id = 2;
UPDATE cards SET cardimg = 'https://static.wikia.nocookie.net/finalfantasy/images/7/74/Sephiroth_Flames_FFVIIR.jpg', carddescription = 'Sephiroth in Nibelheim Flames', rarity_id = 1, genre_id = 1, edition_id = 4 WHERE id = 3;
UPDATE cards SET cardimg = 'https://cdn4.theroar.com.au/wp-content/uploads/2012/09/Andrew-Johns-415x285.jpg', carddescription = 'The GOAT. Enough said', rarity_id = 2, genre_id = 2, edition_id = 1 WHERE id = 4;
UPDATE cards SET cardimg = 'https://images1.resources.foxtel.com.au/store2/mount1/16/4/8rckhq.png', carddescription = 'Sunday nights with Matty Johns', rarity_id = 1, genre_id = 3, edition_id = 2 WHERE id = 5;
UPDATE cards SET cardimg = 'https://assets.sportsboom.com/New_UFC_Light_Heavyweight_Champion_Jon_Jones_363dbbe88b.jpg', carddescription = 'The youngest UFC champion of all time.', rarity_id = 4, genre_id = 3, edition_id = 4 WHERE id = 6;


`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    ...(process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          host: process.env.DB_HOST, // or wherever the db is hosted
          user: process.env.DB_USERNAME,
          database: process.env.DB_USED,
          password: process.env.DB_PASSWORD,
          port: 5432, // The default port
        }),
  });
  await client.connect();
  const { rows } = await client.query(
    "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = 'cards'"
  );

  if (rows[0].count > 0) {
    // Table exists, check if it has data
    const { rows: cardRows } = await client.query(
      "SELECT COUNT(*) as count FROM cards"
    );
    if (cardRows[0].count > 0) {
      console.log("Database already populated, skipping seed");
      return;
    }
  }

  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
