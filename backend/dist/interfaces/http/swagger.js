"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'IESI - Sistema de Gestão Hospitalar API',
        version: '1.0.0',
        description: 'API REST para gestão hospitalar com cadastro de pessoas (médicos, enfermeiros e pacientes), controle de acesso e fluxos administrativos.',
        contact: {
            name: 'IESI Team',
            url: 'https://github.com/Felipeds-L/IESI',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor Docker (Produção)',
        },
        {
            url: 'http://localhost:3333',
            description: 'Servidor de desenvolvimento local',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Pessoa: {
                type: 'object',
                required: ['cpf', 'nome', 'email', 'password', 'dataNascimento'],
                properties: {
                    id: {
                        type: 'integer',
                        description: 'ID único da pessoa',
                        example: 1,
                    },
                    cpf: {
                        type: 'string',
                        description: 'CPF da pessoa (único)',
                        example: '12345678900',
                    },
                    nome: {
                        type: 'string',
                        description: 'Nome completo da pessoa',
                        example: 'João Silva',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email da pessoa (único)',
                        example: 'joao.silva@example.com',
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        description: 'Senha da pessoa',
                        example: 'senha123',
                    },
                    dataNascimento: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Data de nascimento',
                        example: '1990-01-15T00:00:00.000Z',
                    },
                    sexo: {
                        type: 'string',
                        description: 'Sexo da pessoa',
                        example: 'M',
                    },
                    endereco: {
                        type: 'string',
                        description: 'Endereço completo',
                        example: 'Rua das Flores, 123',
                    },
                    telefone: {
                        type: 'string',
                        description: 'Telefone de contato',
                        example: '(11) 98765-4321',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Data de criação do registro',
                    },
                    paciente: {
                        type: 'object',
                        description: 'Dados do paciente (se aplicável)',
                        nullable: true,
                    },
                    funcionario: {
                        type: 'object',
                        description: 'Dados do funcionário (se aplicável)',
                        nullable: true,
                        properties: {
                            dataAdmissao: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Data de admissão',
                            },
                            salario: {
                                type: 'number',
                                description: 'Salário do funcionário',
                            },
                            cargo: {
                                type: 'string',
                                enum: ['ADMINISTRATIVO', 'MEDICO', 'ENFERMEIRO'],
                                description: 'Cargo do funcionário',
                            },
                            crm: {
                                type: 'string',
                                description: 'CRM do médico (apenas para MEDICO)',
                                nullable: true,
                            },
                            coren: {
                                type: 'string',
                                description: 'COREN do enfermeiro (apenas para ENFERMEIRO)',
                                nullable: true,
                            },
                        },
                    },
                },
            },
            CreatePessoaRequest: {
                type: 'object',
                required: ['cpf', 'nome', 'email', 'password', 'dataNascimento'],
                properties: {
                    cpf: {
                        type: 'string',
                        description: 'CPF da pessoa',
                        example: '12345678900',
                    },
                    nome: {
                        type: 'string',
                        description: 'Nome completo',
                        example: 'João Silva',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email',
                        example: 'joao.silva@example.com',
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        description: 'Senha',
                        example: 'senha123',
                    },
                    dataNascimento: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Data de nascimento',
                        example: '1990-01-15T00:00:00.000Z',
                    },
                    sexo: {
                        type: 'string',
                        description: 'Sexo',
                        example: 'M',
                    },
                    endereco: {
                        type: 'string',
                        description: 'Endereço',
                        example: 'Rua das Flores, 123',
                    },
                    telefone: {
                        type: 'string',
                        description: 'Telefone',
                        example: '(11) 98765-4321',
                    },
                    funcionario: {
                        type: 'object',
                        description: 'Dados do funcionário (opcional)',
                        properties: {
                            dataAdmissao: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Data de admissão',
                                example: '2024-01-15T00:00:00.000Z',
                            },
                            salario: {
                                type: 'number',
                                description: 'Salário',
                                example: 5000.00,
                            },
                            cargo: {
                                type: 'string',
                                enum: ['ADMINISTRATIVO', 'MEDICO', 'ENFERMEIRO'],
                                description: 'Cargo',
                                example: 'MEDICO',
                            },
                            crm: {
                                type: 'string',
                                description: 'CRM (apenas para MEDICO)',
                                example: 'CRM123456',
                            },
                            coren: {
                                type: 'string',
                                description: 'COREN (apenas para ENFERMEIRO)',
                                example: 'COREN123456',
                            },
                        },
                    },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email do usuário',
                        example: 'joao.silva@example.com',
                    },
                    password: {
                        type: 'string',
                        format: 'password',
                        description: 'Senha do usuário',
                        example: 'senha123',
                    },
                },
            },
            LoginResponse: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        description: 'JWT token para autenticação',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                    pessoa: {
                        $ref: '#/components/schemas/Pessoa',
                    },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: {
                        type: 'string',
                        description: 'Mensagem de erro',
                        example: 'Erro ao processar requisição',
                    },
                },
            },
        },
    },
};
// Caminhos para os arquivos de rotas (funciona tanto em dev quanto em produção/Docker)
const routesPath = path_1.default.join(__dirname, '../routes/*.{ts,js}');
const controllersPath = path_1.default.join(__dirname, '../controllers/*.{ts,js}');
const options = {
    definition: swaggerDefinition,
    apis: [routesPath, controllersPath],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map