
interface ServiceModel{
    id_servico: number
    nom_servico: string
    desc_servico: string
    id_usuario_solicitante: number
    id_projeto_pai: number | any
    dth_servico: Date
    dth_fim_servico: Date
    num_tempo_estimado: number
    num_qtd_prestadores: number
    id_status: number
    nom_usuario: string
    cod_email_usuario: string
    id_cidade: number
    desc_endereco: string
    nom_status: string
    num_qtd_prestadores_confirmados: number
}

interface ServiceSkillsModel{
    id_servico: number
    id_habilidade: number
    nom_habilidade: string
}

interface ServiceCategoriesModel{
    id_servico: number
    id_categoria: number
    nom_categoria: string
}

interface ServiceProviderUsersModel{
    id_servico: number
    id_usuario_prestador: string
    nom_usuario: string
    cod_email_usuario: string
    num_nota_avaliacao: number | any
    desc_comentario_avaliacao: string | any
}
export { ServiceModel, ServiceSkillsModel, ServiceCategoriesModel, ServiceProviderUsersModel}