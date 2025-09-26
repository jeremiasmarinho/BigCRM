import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
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

interface StatCard {
  name: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href?: string;
}

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    "dashboardStats",
    dashboardAPI.getStats as any
  );

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar dados do dashboard</p>
      </div>
    );
  }

  const {
    recentLeads = [],
    recentClients = [],
    stats,
  } = (data as any)?.data || {};

  const statCards: StatCard[] = [
    {
      name: "Leads Qualificados",
      value: stats?.totalLeads || 0,
      icon: Target,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      href: "/leads",
    },
    {
      name: "Clientes Ativos",
      value: stats?.totalClients || 0,
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      href: "/clients",
    },
    {
      name: "Conversões",
      value: stats?.wonLeads || 0,
      icon: Zap,
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      name: "ROI Médio",
      value: stats?.avgROI || 285,
      icon: TrendingUp,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
  ];

  const getStatusBadge = (status: string): string => {
    return (
      STATUS_BADGE_CLASSES[status as keyof typeof STATUS_BADGE_CLASSES] ||
      STATUS_BADGE_CLASSES.new
    );
  };

  const getPriorityBadge = (priority: string): string => {
    return (
      PRIORITY_BADGE_CLASSES[priority as keyof typeof PRIORITY_BADGE_CLASSES] ||
      PRIORITY_BADGE_CLASSES.medium
    );
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Hero Section */}
          <div className="px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-blue-200 font-medium mb-6 border border-white/10">
                  <Activity className="h-4 w-4 mr-2" />
                  Centro de Performance - Tempo Real
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent tracking-tight">
                  Marketing
                  <br />
                  <span className="text-5xl md:text-7xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Performance
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Transforme dados em resultados. Monitore, analise e otimize
                  suas campanhas com inteligência artificial.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  to="/leads"
                  className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Target className="h-6 w-6 relative z-10" />
                  <span className="relative z-10">Capturar Leads</span>
                </Link>
                <Link
                  to="/clients"
                  className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
                >
                  <Users className="h-6 w-6" />
                  Gerenciar Clientes
                </Link>
              </div>
            </div>
          </div>

          {/* Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.name}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                        {stat.name}
                      </p>
                      <p className="text-4xl font-bold text-gray-900 mb-4">
                        {stat.name === "ROI Médio"
                          ? `${stat.value}%`
                          : stat.value.toLocaleString()}
                      </p>
                      {stat.href && (
                        <Link
                          to={stat.href}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold mt-2 group-hover:translate-x-1 transition-all duration-200"
                        >
                          Ver detalhes
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </div>
                    <div
                      className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversion Rate */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Taxa de Conversão
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-green-600">
                  {stats?.conversionRate || 8.5}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-1000 shadow-inner"
                    style={{ width: `${stats?.conversionRate || 8.5}%` }}
                  ></div>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-2" />
                  +2.3% vs mês anterior
                </div>
              </div>
            </div>

            {/* Cost Per Lead */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Custo por Lead
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-blue-600">
                  R$ {stats?.avgCPL || 47}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <ArrowDownRight className="h-4 w-4 text-green-500 mr-2" />
                  -12% vs mês anterior
                </div>
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Campanhas Ativas
                </h3>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-purple-600">
                  {stats?.activeCampaigns || 12}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <Zap className="h-4 w-4 text-yellow-500 mr-2" />3 em
                  otimização
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Leads */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Leads Recentes
                </h3>
                <Link
                  to="/leads"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                >
                  Ver todos
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead: Lead) => (
                    <div
                      key={lead._id}
                      className="group flex items-center justify-between p-6 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl hover:border-blue-200 hover:bg-blue-50/80 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-1">
                        <Link
                          to={`/leads/${lead._id}`}
                          className="font-bold text-gray-900 hover:text-blue-600 group-hover:text-blue-600 text-lg"
                        >
                          {lead.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1 font-medium">
                          {lead.email}
                        </p>
                        <div className="flex items-center space-x-3 mt-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                              lead.status
                            )}`}
                          >
                            {lead.status}
                          </span>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(
                              lead.priority
                            )}`}
                          >
                            {lead.priority}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 font-medium">
                          {format(new Date(lead.createdAt), "dd MMM")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Target className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">
                      Nenhum lead recente
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Clients */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl hover:bg-white/90 transition-all duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Clientes Recentes
                </h3>
                <Link
                  to="/clients"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                >
                  Ver todos
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentClients.length > 0 ? (
                  recentClients.map((client: Client) => (
                    <div
                      key={client._id}
                      className="group flex items-center justify-between p-6 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl hover:border-green-200 hover:bg-green-50/80 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex-1">
                        <Link
                          to={`/clients/${client._id}`}
                          className="font-bold text-gray-900 hover:text-green-600 group-hover:text-green-600 text-lg"
                        >
                          {client.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1 font-medium">
                          {client.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 font-medium">
                          {format(new Date(client.createdAt), "dd MMM")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Users className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">
                      Nenhum cliente recente
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
