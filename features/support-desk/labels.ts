export function supportDeskTypeLabel(type?: string | null): string {
  switch (type) {
    case "guardian":
      return "Responsável";
    case "student":
      return "Aluno";
    case "teacher":
      return "Professor";
    case "school_admin":
      return "Admin da escola";
    case "akili_admin":
      return "Admin Akili";
    default:
      return type?.trim() || "Não informado";
  }
}

export function supportDeskStatusLabel(status?: string | null): string {
  switch (status) {
    case "active":
      return "Ativo";
    case "invited":
      return "Convite pendente";
    case "inactive":
      return "Inativo";
    case "blocked":
      return "Bloqueado";
    default:
      return status?.trim() || "Não informado";
  }
}

export function canStartAssistanceForUser(user: {
  type: string;
  status: string;
}): boolean {
  return user.type === "guardian" && user.status === "active";
}
