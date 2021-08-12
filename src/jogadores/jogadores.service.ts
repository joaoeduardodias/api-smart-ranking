import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuuidV4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  async criarAtualizarJogador({
    email,
    nome,
    telefoneCelular,
  }: CriarJogadorDTO): Promise<void> {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (jogadorEncontrado) {
      return this.atualizar(jogadorEncontrado, nome);
    } else {
      this.criar({ nome, email, telefoneCelular });
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadores;
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
    const jogador = this.jogadores.find((jogador) => jogador.email === email);

    if (!jogador) {
      throw new NotFoundException(`Jogador com email ${email} não encontrado!`);
    }

    return jogador;
  }

  async deletarJogador(email: string): Promise<void> {
    const jogador = this.jogadores.findIndex(
      (jogador) => jogador.email === email,
    );
    this.jogadores.splice(jogador, 1);
  }

  private criar({ email, nome, telefoneCelular }: CriarJogadorDTO): void {
    const jogador: Jogador = {
      _id: uuuidV4(),
      nome,
      email,
      telefoneCelular,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'avatar',
    };
    this.jogadores.push(jogador);
  }

  private atualizar(jogadorEcontrado: Jogador, nome: string): void {
    jogadorEcontrado.nome = nome;
  }
}
