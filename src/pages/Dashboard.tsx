import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Plus,
  Target,
  DollarSign,
  BarChart3,
  Activity,
  ArrowUpRight,
  Zap,
  MousePointer,
} from "lucide-react";
import { format } from "date-fns";
import { dashboardAPI } from "../services";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  STATUS_BADGE_CLASSES,
  PRIORITY_BADGE_CLASSES,
} from "../utils/constants";
import type { Lead, Client } from "../types";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    "dashboardStats",
    dashboardAPI.getStats as any
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600 text-lg font-semibold">
          Erro ao carregar dados do dashboard
        </p>
      </div>
    );
  }

  const {
    recentLeads = [],
    recentClients = [],
    stats,
  } = (data as any)?.data || {};

  // Cards principais
  const mainCards = [
    {
      name: "Leads Qualificados",
      value: stats?.totalLeads || 0,
      icon: <Target className="h-7 w-7" />,
      color: "from-purple-500 to-purple-700",
      href: "/leads",
    },
    {
      name: "Clientes Ativos",
      value: stats?.totalClients || 0,
      icon: <Users className="h-7 w-7" />,
      color: "from-blue-500 to-blue-700",
      href: "/clients",
    },
    {
      name: "Conversões",
      value: stats?.wonLeads || 0,
      icon: <Zap className="h-7 w-7" />,
      color: "from-green-500 to-green-700",
    },
    {
      name: "ROI Médio",
      value: stats?.avgROI || 285,
      icon: <TrendingUp className="h-7 w-7" />,
      color: "from-orange-500 to-orange-600",
      isPercent: true,
    },
  ];

  // Utilitários para badges
  const getStatusBadge = (status: string): string =>
    STATUS_BADGE_CLASSES[status as keyof typeof STATUS_BADGE_CLASSES] ||
    STATUS_BADGE_CLASSES.new;
  const getPriorityBadge = (priority: string): string =>
    PRIORITY_BADGE_CLASSES[priority as keyof typeof PRIORITY_BADGE_CLASSES] ||
    PRIORITY_BADGE_CLASSES.medium;

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        {/* Título e ações */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-blue-400 bg-clip-text text-transparent mb-2">
              Painel de Performance
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-xl">
              Acompanhe em tempo real os principais indicadores das suas
              campanhas e clientes.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/leads"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/90 border border-slate-200 shadow hover:bg-slate-50 font-semibold text-slate-700 hover:text-blue-700 transition-all"
            >
              <MousePointer className="h-5 w-5" />
              Capturar Lead
            </Link>
            <Link
              to="/clients"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:from-blue-700 hover:to-purple-700 font-semibold transition-all"
            >
              <Plus className="h-5 w-5" />
              Novo Cliente
            </Link>
          </div>
        </header>

        {/* Cards principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mainCards.map((card) => (
            <Link
              to={card.href || "#"}
              key={card.name}
              className={`group relative rounded-2xl p-7 bg-gradient-to-br ${card.color} shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col justify-between min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center rounded-xl bg-white/20 p-2 text-white shadow">
                  {card.icon}
                </span>
                <span className="text-lg font-semibold text-white drop-shadow-sm">
                  {card.name}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-extrabold text-white drop-shadow-lg">
                  {card.isPercent ? `${card.value}%` : card.value}
                </span>
                {card.href && (
                  <span className="ml-2 text-white/80 group-hover:text-white underline text-sm flex items-center gap-1">
                    Ver detalhes <ArrowUpRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Grid de métricas secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Conversão */}
          <div className="rounded-2xl bg-white/90 shadow p-7 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <span className="font-bold text-slate-800 text-lg">
                Taxa de Conversão
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-green-600">
                {stats?.conversionRate || 8.5}%
              </span>
              <span className="text-xs text-green-700 font-semibold bg-green-100 rounded px-2 py-0.5">
                +2.3% mês
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${stats?.conversionRate || 8.5}%` }}
              ></div>
            </div>
          </div>
          {/* CPL */}
          <div className="rounded-2xl bg-white/90 shadow p-7 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-slate-800 text-lg">
                Custo por Lead
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-blue-600">
                R$ {stats?.avgCPL || 47}
              </span>
              <span className="text-xs text-blue-700 font-semibold bg-blue-100 rounded px-2 py-0.5">
                -12% mês
              </span>
            </div>
          </div>
          {/* Campanhas */}
          <div className="rounded-2xl bg-white/90 shadow p-7 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-slate-800 text-lg">
                Campanhas Ativas
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-purple-600">
                {stats?.activeCampaigns || 12}
              </span>
              <span className="text-xs text-purple-700 font-semibold bg-purple-100 rounded px-2 py-0.5">
                3 em otimização
              </span>
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leads Recentes */}
          <section className="rounded-2xl bg-white/95 shadow p-7 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900">
                Leads Recentes
              </h2>
              <Link
                to="/leads"
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1"
              >
                Ver todos <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {recentLeads.length > 0 ? (
                recentLeads.slice(0, 5).map((lead: Lead) => (
                  <div
                    key={lead._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50/60 transition-all"
                  >
                    <div>
                      <Link
                        to={`/leads/${lead._id}`}
                        className="font-bold text-slate-900 hover:text-blue-700 text-base"
                      >
                        {lead.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        {lead.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadge(
                            lead.priority
                          )}`}
                        >
                          {lead.priority}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {format(new Date(lead.createdAt), "dd MMM")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  Nenhum lead recente
                </div>
              )}
            </div>
          </section>
          {/* Clientes Recentes */}
          <section className="rounded-2xl bg-white/95 shadow p-7 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900">
                Clientes Recentes
              </h2>
              <Link
                to="/clients"
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1"
              >
                Ver todos <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {recentClients.length > 0 ? (
                recentClients.slice(0, 5).map((client: Client) => (
                  <div
                    key={client._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-green-50/60 transition-all"
                  >
                    <div>
                      <Link
                        to={`/clients/${client._id}`}
                        className="font-bold text-slate-900 hover:text-green-700 text-base"
                      >
                        {client.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        {client.email}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {format(new Date(client.createdAt), "dd MMM")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  Nenhum cliente recente
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
