import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuuidV4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];

  constructor(
    @InjectModel('Jogador')
    private readonly jogadorModule: Model<Jogador>,
  ) {}

  async criarAtualizarJogador({
    email,
    nome,
    telefoneCelular,
  }: CriarJogadorDTO): Promise<void> {
    // const jogadorEncontrado = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );

    const jogadorEncontrado = await this.jogadorModule
      .findOne({ email })
      .exec();

    if (jogadorEncontrado) {
      await this.atualizar({ email, nome, telefoneCelular });
    } else {
      this.criar({ nome, email, telefoneCelular });
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModule.find().exec();

    // return this.jogadores;
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
    const jogador = await this.jogadorModule.findOne({ email }).exec();

    if (!jogador) {
      throw new NotFoundException(`Jogador com email ${email} não encontrado!`);
    }

    return jogador;
  }

  async deletarJogador(email: string): Promise<any> {
    return await this.jogadorModule.remove({ email }).exec();

    // const jogador = this.jogadores.findIndex(
    //   (jogador) => jogador.email === email,
    // );
    // this.jogadores.splice(jogador, 1);
  }

  private async criar({
    email,
    nome,
    telefoneCelular,
  }: CriarJogadorDTO): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModule({
      email,
      nome,
      telefoneCelular,
    });

    return await jogadorCriado.save();

    // const jogador: Jogador = {
    //   nome,
    //   email,
    //   telefoneCelular,
    //   ranking: 'A',
    //   posicaoRanking: 1,
    //   urlFotoJogador: 'avatar',
    // };
    // this.jogadores.push(jogador);
  }

  private async atualizar(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    return await this.jogadorModule
      .findOneAndUpdate(
        { email: criarJogadorDTO.email },
        { $set: criarJogadorDTO },
      )
      .exec();

    // jogadorEcontrado.nome = nome;
  }
}
