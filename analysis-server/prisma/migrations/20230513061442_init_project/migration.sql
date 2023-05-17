-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tokenRefresh" TEXT,
    "senhaResetToken" TEXT,
    "senhaResetExpira" TIMESTAMP(3),
    "eAtivo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "eAtivo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gruposContabil" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gruposContabil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analiticosContabil" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "empresaId" TEXT NOT NULL,
    "grupoContabilId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analiticosContabil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filiais" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lacamentosContabil" (
    "id" TEXT NOT NULL,
    "lote" TEXT NOT NULL,
    "lancamento" TEXT NOT NULL,
    "historico" TEXT NOT NULL,
    "hierarquia" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "dataLancamento" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "empresaId" TEXT NOT NULL,
    "filialId" TEXT,
    "analiticoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lacamentosContabil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnaliticoToFilial" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_id_key" ON "usuarios"("id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_id_key" ON "empresas"("id");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "gruposContabil_id_key" ON "gruposContabil"("id");

-- CreateIndex
CREATE UNIQUE INDEX "gruposContabil_codigo_empresaId_key" ON "gruposContabil"("codigo", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "analiticosContabil_id_key" ON "analiticosContabil"("id");

-- CreateIndex
CREATE UNIQUE INDEX "analiticosContabil_codigo_empresaId_key" ON "analiticosContabil"("codigo", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "filiais_id_key" ON "filiais"("id");

-- CreateIndex
CREATE UNIQUE INDEX "filiais_codigo_empresaId_key" ON "filiais"("codigo", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "lacamentosContabil_id_key" ON "lacamentosContabil"("id");

-- CreateIndex
CREATE UNIQUE INDEX "lacamentosContabil_documento_lancamento_lote_tipo_valor_dat_key" ON "lacamentosContabil"("documento", "lancamento", "lote", "tipo", "valor", "dataLancamento", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "_AnaliticoToFilial_AB_unique" ON "_AnaliticoToFilial"("A", "B");

-- CreateIndex
CREATE INDEX "_AnaliticoToFilial_B_index" ON "_AnaliticoToFilial"("B");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gruposContabil" ADD CONSTRAINT "gruposContabil_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analiticosContabil" ADD CONSTRAINT "analiticosContabil_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analiticosContabil" ADD CONSTRAINT "analiticosContabil_grupoContabilId_fkey" FOREIGN KEY ("grupoContabilId") REFERENCES "gruposContabil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filiais" ADD CONSTRAINT "filiais_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lacamentosContabil" ADD CONSTRAINT "lacamentosContabil_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lacamentosContabil" ADD CONSTRAINT "lacamentosContabil_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "filiais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lacamentosContabil" ADD CONSTRAINT "lacamentosContabil_analiticoId_fkey" FOREIGN KEY ("analiticoId") REFERENCES "analiticosContabil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnaliticoToFilial" ADD CONSTRAINT "_AnaliticoToFilial_A_fkey" FOREIGN KEY ("A") REFERENCES "analiticosContabil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnaliticoToFilial" ADD CONSTRAINT "_AnaliticoToFilial_B_fkey" FOREIGN KEY ("B") REFERENCES "filiais"("id") ON DELETE CASCADE ON UPDATE CASCADE;
