import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ParseCsv } from '../../utils/ParseCsv.utils';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService, private parseCsv: ParseCsv) {}

  findOne(id: number) {
    return `This action returns a #${id} finance`;
  }

  async importFinanceReleases(file: Express.Multer.File, userId: string) {
    const findUser = await this.prisma.usuario.findUnique({
      where: {
        id: userId,
      },
      select: {
        empresaId: true,
      },
    });

    console.log('cheguei importFinanceReleases');

    const empresaId = findUser.empresaId;

    const releases = await this.parseCsv.execute(file);

    for (const releaseArray of releases.slice(1)) {
      const [
        lote,
        lancamento,
        historico,
        documento,
        dataLancamento,
        valor,
        tipo,
        hierarquia,
        analitico,
        _analiticoDescricao,
      ] = releaseArray;

      const [day, month, year] = dataLancamento.split('/');
      const normalizedDate = new Date(`${year}-${month}-${day}`);

      const hierarquiaSplit = hierarquia.split('.');
      let filial = undefined;

      if (hierarquiaSplit && hierarquiaSplit.length >= 4 && hierarquiaSplit[4])
        filial = String(Number(hierarquiaSplit[4]));

      try {
        const exist = await this.prisma.lacamentoContabil.findFirst({
          select: {
            id: true,
          },
          where: {
            tipo: String(tipo),
            lote: String(hierarquia),
            lancamento: String(lancamento),
            documento: String(lancamento),
          },
        });

        if (exist) {
          console.log('UPDATE!');

          await this.prisma.lacamentoContabil.update({
            data: {
              historico: String(historico),
              hierarquia: String(hierarquia),
              dataLancamento: normalizedDate,
              valor: Number(valor.replace(',', '.')),
              filialCodigo: filial,
            },

            where: {
              id: exist.id,
            },
          });
        } else {
          console.log('CREATE!');

          await this.prisma.lacamentoContabil.create({
            select: {
              id: true,
            },
            data: {
              empresaId,
              historico: String(historico),
              hierarquia: String(hierarquia),
              lote: String(lote),
              lancamento: String(lancamento),
              documento: String(documento),
              dataLancamento: normalizedDate,
              tipo: tipo,
              valor: Number(valor.replace(',', '.')),
              analitico: {
                connect: {
                  codigo_empresaId: {
                    codigo: String(analitico),
                    empresaId
                  }
                }
              }
              filial: {
                connect: {
                  codigo_empresaId: {
                    codigo: filial,
                    empresaId
                  }
                }
              }
            },
          });
        }
      } catch (error) {
        console.log(error);

        console.log({
          lote,
          lancamento,
          historico,
          documento,
          dataLancamento,
          valor,
          tipo,
          hierarquia,
          analitico,
          _analiticoDescricao,
        });

        console.log(releaseArray);
      }
    }

    console.log('sai importFinanceReleases');

    return;
  }
  async importFinancePlans(file: Express.Multer.File, userId: string) {
    const findUser = await this.prisma.usuario.findUnique({
      where: {
        id: userId,
      },
      select: {
        empresaId: true,
      },
    });

    console.log('cheguei importFinancePlans');

    const empresaId = findUser.empresaId;

    const plans = await this.parseCsv.execute(file);

    for (const planArray of plans.slice(1)) {
      const [
        _analitico,
        _filial,
        _analiticoDescricao,
        grupoContabil,
        grupoContabilDescricao,
        _grupoResultado,
        _grupoResultadoDescricao,
        _hierarquia,
      ] = planArray;

      await this.prisma.grupoContabil.upsert({
        create: {
          codigo: String(grupoContabil),
          descricao: String(grupoContabilDescricao),
          empresaId,
        },
        update: {
          descricao: String(grupoContabilDescricao),
        },
        where: {
          codigo: String(grupoContabil),
        },
      });
    }
    for (const planArray of plans.slice(1)) {
      const [
        analitico,
        filial,
        _analiticoDescricao,
        grupoContabil,
        _grupoContabilDescricao,
        _grupoResultado,
        _grupoResultadoDescricao,
        _hierarquia,
      ] = planArray;

      await this.prisma.filial.upsert({
        create: {
          codigo: String(filial),
          descricao: String(filial),
          empresaId,
        },
        update: {
          descricao: String(filial),
        },
        where: {
          codigo: String(filial),
        },
      });
    }
    for (const planArray of plans.slice(1)) {
      const [
        analitico,
        filial,
        analiticoDescricao,
        grupoContabil,
        _grupoContabilDescricao,
        _grupoResultado,
        _grupoResultadoDescricao,
        _hierarquia,
      ] = planArray;

      await this.prisma.analitico.upsert({
        create: {
          codigo: String(analitico),
          descricao: String(analiticoDescricao),
          grupoContabil: {
            connect: {
              codigo_empresaId: {
                codigo: String(grupoContabil),
                empresaId,
              },
            },
          },
          filial: {
            connect: {
              codigo_empresaId: {
                codigo: String(filial),
                empresaId,
              },
            },
          },
          empresaId,
        },
        update: {
          descricao: String(analiticoDescricao),
          grupoContabil: {
            connect: {
              codigo_empresaId: {
                codigo: String(grupoContabil),
                empresaId,
              },
            },
          },

          filial: {
            connect: {
              codigo_empresaId: {
                codigo: String(analitico),
                empresaId,
              },
            },
          },
        },
        where: {
          codigo_empresaId: {
            codigo: String(analitico),
            empresaId,
          },
        },
      });
    }

    console.log('sai importFinancePlans');
    return;
  }
}
