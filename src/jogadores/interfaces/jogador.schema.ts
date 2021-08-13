import * as mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema(
  {
    telefoneCelular: { type: 'string', unique: true },
    email: { type: 'string', unique: true },
    nome: String,
    ranking: String,
    posicaoRanking: Number,
    urlFotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
