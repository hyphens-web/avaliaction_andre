"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Search, 
  Download, 
  ChevronRight, 
  UserCircle, 
  ArrowLeft, 
  Star, 
  Calendar,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// --- TIPAGEM ---
type Avaliacao = {
  id: string
  data: string
  nota: number
  comentario: string
  supervisorQueAvaliou: string
}

type Colaborador = {
  id: string
  nome: string
  cpf: string
  supervisorFixo: string // Supervisor responsável por ele
  totalAvaliacoes: number
  mediaNota: number
  avaliacoes: Avaliacao[]
}

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroData, setFiltroData] = useState("")

  useEffect(() => {
    // Simulação de dados para larga escala (+1000)
    const mockData: Colaborador[] = [
      {
        id: "1",
        nome: "Alan Ferreira",
        cpf: "123.456.789-00",
        supervisorFixo: "Marcos Oliveira",
        totalAvaliacoes: 1240,
        mediaNota: 4.9,
        avaliacoes: [
          { id: "a1", data: "2026-03-02", nota: 5, comentario: "Ótima produtividade no setor A.", supervisorQueAvaliou: "Marcos Oliveira" },
          { id: "a2", data: "2026-03-01", nota: 4, comentario: "Cumpriu todas as metas.", supervisorQueAvaliou: "Clara Mendes" },
        ]
      },
      {
        id: "2",
        nome: "Beatriz Souza",
        cpf: "987.654.321-11",
        supervisorFixo: "Clara Mendes",
        totalAvaliacoes: 850,
        mediaNota: 4.7,
        avaliacoes: [
          { id: "b1", data: "2026-03-02", nota: 5, comentario: "Muito dedicada ao atendimento.", supervisorQueAvaliou: "Clara Mendes" },
        ]
      }
    ]
    setColaboradores(mockData)
  }, [])

  // Função de Exportação Profissional
  const handleExport = (colab: Colaborador) => {
    const csv = `Data;Nota;Supervisor;Comentario\n` + 
      colab.avaliacoes.map(a => `${a.data};${a.nota};${a.supervisorQueAvaliou};"${a.comentario}"`).join("\n")
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Relatorio_${colab.nome.replace(/\s/g, '_')}.csv`
    a.click()
    toast.success("Relatório CSV gerado com sucesso!")
  }

  // Filtro de busca inteligente (Nome, CPF ou Supervisor)
  const filtered = colaboradores.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cpf.includes(searchTerm) ||
    c.supervisorFixo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto transition-opacity duration-500 ease-in-out">
      {!selectedColaborador ? (
        <div className="space-y-6">
          {/* CABEÇALHO COM FILTRO DE DATA ESTILIZADO */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Users className="text-emerald-500 h-6 w-6" /> GESTÃO DE COLABORADORES
              </h1>
              <p className="text-xs text-slate-500 font-medium">Visualizando {filtered.length} registros ativos</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Nome, CPF ou Supervisor..." 
                  className="pl-10 w-full md:w-[300px] bg-slate-50 border-none rounded-xl text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* FILTRO DE DATA PROFISSIONAL */}
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-2 px-4 rounded-xl">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase leading-none">Filtrar por data</span>
                  <input 
                    type="date" 
                    className="bg-transparent border-none text-sm focus:outline-none font-bold text-emerald-900"
                    value={filtroData}
                    onChange={(e) => setFiltroData(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TABELA OTIMIZADA PARA MUITOS DADOS */}
          <Card className="border-none shadow-sm overflow-hidden rounded-2xl border border-slate-100">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-slate-500 uppercase text-[11px]">Colaborador</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[11px] text-center">Supervisor Responsável</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[11px] text-center">Total Avaliações</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-[11px] text-center">Média</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((colab) => (
                  <TableRow 
                    key={colab.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    onClick={() => setSelectedColaborador(colab)}
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          <UserCircle size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-none">{colab.nome}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-1">{colab.cpf}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-semibold text-slate-600 border-slate-200 bg-white">
                        {colab.supervisorFixo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-600 text-sm">{colab.totalAvaliacoes}</TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1 font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-xs">
                        <Star className="h-3 w-3 fill-emerald-600" /> {colab.mediaNota}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        /* RELATÓRIO DETALHADO (VISÃO AO CLICAR) */
        <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-500">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedColaborador(null)} 
            className="hover:bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para lista
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* CARD INFO PRINCIPAL */}
            <Card className="lg:col-span-3 border-none shadow-lg rounded-[2rem] p-8 bg-white border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                    <ShieldCheck size={40} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">{selectedColaborador.nome}</h2>
                    <div className="flex items-center gap-3 mt-1 font-bold text-xs uppercase tracking-tighter">
                      <span className="text-slate-400">{selectedColaborador.cpf}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                      <span className="text-emerald-500">Supervisor: {selectedColaborador.supervisorFixo}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleExport(selectedColaborador)} className="bg-slate-900 hover:bg-black text-white rounded-2xl h-12 px-6 font-bold gap-2 shadow-lg">
                  <FileSpreadsheet size={18} /> Exportar Relatório
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <TrendingUp size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Média de Satisfação</span>
                  </div>
                  <div className="text-4xl font-black text-emerald-600">{selectedColaborador.mediaNota}</div>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Users size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Feedbacks Totais</span>
                  </div>
                  <div className="text-4xl font-black text-blue-600">{selectedColaborador.totalAvaliacoes}</div>
                </div>
              </div>

              <div className="mt-10">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   Histórico de Avaliações <div className="h-[1px] flex-1 bg-slate-100"></div>
                 </h3>
                 <div className="rounded-2xl border border-slate-100 overflow-hidden">
                   <Table>
                     <TableHeader className="bg-slate-50">
                       <TableRow>
                         <TableHead className="text-[10px] font-bold uppercase">Data</TableHead>
                         <TableHead className="text-[10px] font-bold uppercase">Quem Avaliou</TableHead>
                         <TableHead className="text-[10px] font-bold uppercase">Nota</TableHead>
                         <TableHead className="text-[10px] font-bold uppercase">Feedback</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {selectedColaborador.avaliacoes.map((av) => (
                         <TableRow key={av.id} className="animate-in fade-in duration-500">
                           <TableCell className="text-xs font-bold text-slate-500">{av.data}</TableCell>
                           <TableCell>
                             <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                               {av.supervisorQueAvaliou}
                             </Badge>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-1 font-black text-emerald-600 text-xs">
                               {av.nota} <Star size={10} className="fill-emerald-600" />
                              </div>
                           </TableCell>
                           <TableCell className="text-xs text-slate-500 italic">
                             "{av.comentario}"
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </div>
              </div>
            </Card>

            {/* CARD LATERAL STATUS */}
            <div className="space-y-4">
              <Card className="border-none shadow-md rounded-3xl p-6 bg-emerald-600 text-white">
                <h4 className="font-bold text-sm mb-4 uppercase tracking-widest opacity-80">Status do Perfil</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span>Performance</span>
                    <span className="font-bold">Alta</span>
                  </div>
                  <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[90%]"></div>
                  </div>
                  <p className="text-[10px] opacity-70 leading-tight pt-2">
                    Este colaborador está no top 5% de avaliações positivas este mês.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}