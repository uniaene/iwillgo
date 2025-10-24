import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  // Pode vir do banco, mas aqui vai um exemplo fixo
  const locais = [
    { id: 1, local: "I Will Go - Chile" }
  ];
  res.json(locais);
});

export default router;
