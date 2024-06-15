const { Router } = require("express");
const {
  handleUserUrl,
  handleCreateUrl,
  handleHistory,
} = require("../controller/urlcontroler");
const router = Router();
// redirect router handler
router.get("/:shortId", handleUserUrl);

// create url router handler
router.post("/", handleCreateUrl);

// get history router handler
router.get("/history/:shortId", handleHistory);

module.exports = router;
