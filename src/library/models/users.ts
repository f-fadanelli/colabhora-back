
interface UserModel{
    id_usuario: number
    nom_usuario: string
    cod_cadastro: string
    cod_email_usuario: string
    cod_senha_usuario: string | any
    num_saldo_horas: number
    id_cidade: number
    desc_endereco: string
    flg_tipo_usuario: string
    desc_area_atuacao: string | any
    nom_cidade: string
    nom_estado: string
    cod_uf_estado: string
}

interface UserSkillsModel{
    id_usuario: number
    id_habilidade: number
    nom_habilidade: string
}

export { UserModel, UserSkillsModel }