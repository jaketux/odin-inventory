const db = require("../db/queries");

async function serveHomepage(req, res) {
  const cards = await db.getAllCards();
  if (cards.length === 0) {
    res.render("index", {
      title: "Home",
    });
  } else {
    res.render("index", {
      title: "Your collection",
      cards: cards,
      // cards: cards from card database here
    });
  }
}

async function serveGenres(req, res) {
  // genres: genres from genre table db query here
  const genres = await db.getAllGenres();
  console.log(genres);
  res.render("genres", {
    title: "Genres",
    genres: genres,
  });
}

async function serveGenre(req, res) {
  // genre: pull all genre with matching id of req.body and serve it up here

  const genreId = parseInt(req.params.id);

  try {
    const cards = await db.getByGenre(genreId);
    res.render("genre", {
      //title should be the title of the genre as pulled from DB
      // cards: cards from card database here that match that genre

      title: cards[0].genre_name,
      cards: cards,
    });
  } catch (error) {
    res.render("genres", {
      title: "Genres",
      messageText: "You currently have no cards linked to that Genre.",
    });
  }

  console.log(cards);
}

async function updateGenreGet(req, res) {
  const genres = await db.getAllGenres();

  const genreId = parseInt(req.params.id);

  const foundGenre = genres.find((item) => item.id === genreId);

  //query database to obtain specific genre here using req.params.id???
  res.render("update", {
    title: "Update genre",
    //genre name fed in from above
    genre: foundGenre,

    // pass through current genre information
  });
}

async function updateGenrePost(req, res) {
  const newGenreName = req.body.update;
  const genreId = parseInt(req.params.id);
  await db.updateGenreName(newGenreName, genreId);
  // db function to update that specific information using req params.
  res.redirect("/genres");
}

async function serveEditions(req, res) {
  // edition: edition from genre table db query here

  const editions = await db.getAllEditions();
  console.log(editions);

  res.render("editions", {
    title: "Editions",
    editions: editions,
  });
}

async function serveEdition(req, res) {
  // edition: pull all edition with matching id of req.body and serve it up here
  const editionId = parseInt(req.params.id);
  const cards = await db.getByEdition(editionId);
  console.log(cards);
  if (cards.length > 0) {
    res.render("edition", {
      //title should be the title of the edition as pulled from DB
      // cards: cards from card database here that match that edition

      title: cards[0].edition_name,
      cards: cards,
    });
  } else {
    res.render("edition", {
      //title should be the title of the edition as pulled from DB
      // cards: cards from card database here that match that edition

      title: "No cards found",
      message: "You do not have any cards under that Edition.",
    });
  }
}

async function updateEditionGet(req, res) {
  //query database to obtain specific edition here using req.params.id???

  const editions = await db.getAllEditions();

  const editionsId = parseInt(req.params.id);

  const foundEdition = editions.find((item) => item.id === editionsId);

  res.render("update", {
    title: "Update edition",
    //edition name fed in from above
    edition: foundEdition,

    // pass through current edition information
  });
}

async function updateEditionPost(req, res) {
  const newEditionName = req.body.update;
  const editionId = parseInt(req.params.id);
  await db.updateEditionName(newEditionName, editionId);
  // db function to update that specific information using req params.
  res.redirect("/editions");
}

async function updateCardGet(req, res) {
  const cards = await db.getAllCards();
  const genres = await db.getAllGenres();
  const editions = await db.getAllEditions();
  const raritys = await db.getAllRaritys();

  const targetId = parseInt(req.params.id);

  const foundCard = cards.find((item) => item.card_id === targetId);

  //query database to obtain specific card here using req.params.id???
  res.render("update", {
    title: "Update card",
    card: foundCard,
    genres: genres,
    editions: editions,
    raritys: raritys,

    // pass through current card information
  });
}

async function updateCardPost(req, res) {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  const description = req.body.description;
  const rarity = parseInt(req.body.rarity);
  const genre = parseInt(req.body.genre);
  const edition = parseInt(req.body.edition);
  console.log(id, name, description, rarity, genre, edition);

  await db.updateCard(id, name, description, rarity, genre, edition);

  // take req.body information and update DB based on that information.

  // db function to update that specific card information using req params.
  res.redirect("/");
}

async function newCardGet(req, res) {
  const genres = await db.getAllGenres();
  const editions = await db.getAllEditions();
  const raritys = await db.getAllRaritys();

  res.render("create", {
    title: "New card",
    genres: genres,
    editions: editions,
    raritys: raritys,
  });
}

async function newCardPost(req, res) {
  const name = req.body.name;
  const description = req.body.description;
  const rarity = parseInt(req.body.rarity);
  const genre = parseInt(req.body.genre);
  const edition = parseInt(req.body.edition);
  const cardimg = req.body.img;
  await db.createCard(name, rarity, genre, edition, description, cardimg);
  res.redirect("/");
}

async function newGenreGet(req, res) {
  res.render("create", {
    title: "New genre",
    newGenre: true,
  });
}

async function newGenrePost(req, res) {
  const newGenre = req.body.genre;
  await db.createGenre(newGenre);
  res.redirect("/genres");
}

async function newEditionGet(req, res) {
  res.render("create", {
    title: "New edition",
    newEdition: true,
  });
}

async function newEditionPost(req, res) {
  const newEdition = req.body.edition;
  await db.createEdition(newEdition);
  res.redirect("/editions");
}

async function deleteCardPost(req, res) {
  const cardId = parseInt(req.params.id);
  await db.deleteCard(cardId);
  res.redirect("/");
}

async function deleteGenrePost(req, res) {
  const genreId = parseInt(req.params.id);
  try {
    await db.deleteGenre(genreId);
    res.redirect("/genres");
  } catch (error) {
    res.render("genres", {
      title: "Genres",
      messageText:
        "That genre is still linked to a card. To remove this genre you must first link a new genre to your card. ",
    });
  }
}

async function deleteEditionPost(req, res) {
  const editionId = parseInt(req.params.id);

  try {
    await db.deleteEdition(editionId);
    res.redirect("/editions");
  } catch (error) {
    res.render("editions", {
      title: "Editions",
      messageText:
        "That edition type is still link to a card. To remove this edition type you must first link a new edition type to your card. ",
    });
  }
}

module.exports = {
  serveHomepage,
  updateCardGet,
  serveGenres,
  serveGenre,
  updateGenreGet,
  updateGenrePost,
  serveEditions,
  serveEdition,
  updateEditionGet,
  updateEditionPost,
  updateCardPost,
  newCardGet,
  newCardPost,
  newGenreGet,
  newGenrePost,
  newEditionGet,
  newEditionPost,
  deleteCardPost,
  deleteGenrePost,
  deleteEditionPost,
};
