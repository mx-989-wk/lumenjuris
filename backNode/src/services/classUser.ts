import { prisma } from "../../prisma/singletonPrisma"
import bcrypt from "bcrypt"
import { formatCompanyProfile } from "./classEnterprise"

type CreateDataDTO = {
    email: string
    nom?: string
    prenom?: string
    password?: string
    cgu: boolean
}

type UserAuthData = {
    idUser: number
    email: string
    role: string
    isVerified: boolean
}

type DataUpdatedDTO = {
    email?: string
    nom?: string
    prenom?: string
    password?: string
}

type ReturnData<T = any> = {
    success: boolean
    message?: string
    data?: T
}

export class User {
    private errorCatching(err: unknown, fn: string): { success: boolean, message: string } {
        const e = err as any

        console.error(`Erreur dans la fonction ${fn} : \n\n`, err)

        const constraintMap: Record<string, string> = {
            User_email_key: "Cet email est déjà utilisé.",
        }

        if (e?.code === "P2002") {
            const message: string = e?.message || ""

            for (const key in constraintMap) {
                if (message.includes(key)) {
                    return {
                        success: false,
                        message: constraintMap[key],
                    }
                }
            }

            return {
                success: false,
                message: "Une valeur unique est déjà utilisée.",
            }
        }

        if (e?.code === "P2005") {
            return {
                success: false,
                message: "Aucun compte utilisateur n'a été retrouvé.",
            }
        }

        return {
            success: false,
            message: "Une erreur est survenue avec le serveur, merci de réessayer plus tard.",
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound)
        const passwordHash = await bcrypt.hash(password, salt)
        return passwordHash
    }

    // Charge la ligne utilisateur avec sa relation entreprise, utile pour les écrans profil.
    private async findById(idUser: number) {
        return prisma.user.findUnique({
            where: { idUser },
            include: {
                enterprise: {
                    include: {
                        address: true,
                    },
                },
            },
        })
    }

    async create(data: CreateDataDTO): Promise<ReturnData> {
        try {
            const { email, nom, prenom, password, cgu } = data
            const passwordHash = password ? await this.hashPassword(password) : null

            const newUser = await prisma.user.create({
                data: {
                    email,
                    nom,
                    prenom,
                    password: passwordHash,
                    cgu,
                },
            })

            console.log("New user create with prisma : ", newUser)
            return {
                success: true,
                message: "Le compte utilisateur a été créé avec succès.",
                data: newUser,
            }
        } catch (err) {
            return this.errorCatching(err, "User.create")
        }
    }

    async authenticate(password: string, email: string): Promise<ReturnData<UserAuthData>> {
        try {
            const findUser = await prisma.user.findUnique({
                where: { email },
            })

            if (!findUser?.password) {
                return {
                    success: false,
                    message: "Email ou mot de passe invalide",
                }
            }

            const verifyPassword = await bcrypt.compare(password, findUser.password)

            return {
                success: verifyPassword,
                message: verifyPassword ? "Connexion réussite" : "Email ou mot de passe invalide",
                data: {
                    email: findUser.email,
                    role: findUser.role,
                    isVerified: findUser.isVerified,
                    idUser: findUser.idUser,
                },
            }
        } catch (err) {
            return this.errorCatching(err, "User.authenticate")
        }
    }

    async update(idUser: number, dataUpdated: DataUpdatedDTO): Promise<ReturnData> {
        try {
            const nextDataUpdated = { ...dataUpdated }

            if (nextDataUpdated.password) {
                nextDataUpdated.password = await this.hashPassword(nextDataUpdated.password)
            }

            await prisma.user.update({
                where: { idUser },
                data: nextDataUpdated,
            })

            return {
                success: true,
                message: "Les informations ont été mises à jour",
            }
        } catch (err) {
            return this.errorCatching(err, "User.update")
        }
    }

    async get(idUser: number): Promise<ReturnData> {
        try {
            const dataUser = await this.findById(idUser)

            if (!dataUser) {
                return {
                    success: false,
                    message: "Aucune donnée utilisateur n'a été retrouvée.",
                }
            }

            return {
                success: true,
                message: "Les données de l'utilisateur ont été récupérées avec succès.",
                data: {
                    email: dataUser.email,
                    nom: dataUser.nom,
                    prenom: dataUser.prenom,
                    role: dataUser.role,
                    isVerified: dataUser.isVerified,
                    stripeCustomerId: dataUser.stripeCustomerId,
                    enterprise: formatCompanyProfile(dataUser.enterprise),
                },
            }
        } catch (err) {
            return this.errorCatching(err, "User.get")
        }
    }
}
