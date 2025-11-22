import { useState } from 'react';

function App() {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  
  // Estados para recuperação de acesso
  const [mostrarRecuperar, setMostrarRecuperar] = useState<boolean>(false);
  const [emailRecuperar, setEmailRecuperar] = useState<string>('');
  const [carregandoRecuperar, setCarregandoRecuperar] = useState<boolean>(false);
  const [mensagemRecuperar, setMensagemRecuperar] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Email ou senha incorretos');
      }

      // Salva o token no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.pessoa));

      // Redireciona ou mostra sucesso
      alert(`Login realizado com sucesso! Bem-vindo, ${data.pessoa.nome}!`);
      console.log('Login realizado:', data);
      
      // Aqui você pode redirecionar para outra página
      // window.location.href = '/dashboard';
    } catch (error: any) {
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        setErro('Erro de conexão. Verifique se o backend está rodando.');
      } else if (error.message) {
        setErro(error.message);
      } else {
        setErro('Erro ao fazer login. Verifique suas credenciais.');
      }
      console.error('Erro no login:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Fundo com imagem borrada de corredor de hospital */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/corredor-hospital.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(12px) brightness(0.7)',
          transform: 'scale(1.2)',
          left: '-10%',
          top: '-10%',
          width: '120%',
          height: '120%',
          zIndex: 0
        }}
      />
      {/* Overlay escuro semi-transparente para melhor contraste */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(22, 9, 16, 0.3)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Banner azul no topo esquerdo */}
        <div className="pt-[41px] pl-[28px]">
          <div 
            className="text-white inline-block"
            style={{
              backgroundColor: '#6EB9FF',
              width: '820px',
              maxWidth: 'calc(100vw - 56px)',
              height: '65px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '28px',
              paddingRight: '28px'
            }}
          >
            <h2 
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '29px',
                color: '#FFFFFF'
              }}
            >
              Bem-vindo ao Sistema de Gestão do Hospital Oliveira de Menezes
            </h2>
          </div>
        </div>

        {/* Card de login centralizado */}
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="bg-white"
            style={{
              width: '460px',
              height: '443px',
              borderRadius: '4px',
              boxShadow: '2px 2px 0px rgba(85, 79, 79, 0.25)',
              padding: '44px 46px'
            }}
          >
            <h1 
              className="mb-6 text-center"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '29px',
                color: 'rgba(0, 0, 0, 0.8)'
              }}
            >
              Acessar a sua conta
            </h1>

            <form onSubmit={handleSubmit}>
              {/* Mensagem de erro */}
              {erro && (
                <div style={{
                  backgroundColor: '#fee',
                  color: '#c33',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '18px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {erro}
                </div>
              )}

              {/* Campo Email */}
              <div style={{ marginBottom: '18px' }}>
                <label 
                  htmlFor="email" 
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: '22px',
                    color: 'rgba(0, 0, 0, 0.8)',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o seu email..."
                  required
                  disabled={carregando}
                  style={{
                    width: '369px',
                    height: '55px',
                    backgroundColor: '#DFECFB',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0 20px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '19px',
                    color: email ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
                    outline: 'none',
                    opacity: carregando ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    e.target.style.color = 'rgba(0, 0, 0, 0.8)';
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.style.color = 'rgba(0, 0, 0, 0.5)';
                    }
                  }}
                />
              </div>

              {/* Campo Senha */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="senha"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: '22px',
                    color: 'rgba(0, 0, 0, 0.8)',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite a sua senha..."
                  required
                  disabled={carregando}
                  style={{
                    width: '369px',
                    height: '55px',
                    backgroundColor: '#DFECFB',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0 20px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '19px',
                    color: senha ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
                    outline: 'none',
                    opacity: carregando ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    e.target.style.color = 'rgba(0, 0, 0, 0.8)';
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.style.color = 'rgba(0, 0, 0, 0.5)';
                    }
                  }}
                />
              </div>

              {/* Botão Entrar */}
              <div className="flex justify-center" style={{ marginTop: '24px' }}>
                <button
                  type="submit"
                  disabled={carregando}
                  style={{
                    width: '180px',
                    height: '45px',
                    backgroundColor: carregando ? '#9ec5f0' : '#6EB9FF',
                    borderRadius: '4px',
                    border: 'none',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: '22px',
                    color: '#FFFFFF',
                    cursor: carregando ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.2s',
                    opacity: carregando ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!carregando) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = carregando ? 0.7 : '1';
                  }}
                >
                  {carregando ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Botão Recuperar Acesso no canto inferior direito */}
        <div className="pb-6 pr-6 flex justify-end">
          <button 
            onClick={() => setMostrarRecuperar(true)}
            style={{
              width: '234px',
              height: '45px',
              backgroundColor: '#6EB9FF',
              borderRadius: '4px',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '22px',
              color: '#FFFFFF',
              cursor: 'pointer',
              filter: 'drop-shadow(2px 2px 0px rgba(85, 79, 79, 0.25))',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Recuperar Acesso
          </button>
        </div>

        {/* Modal de Recuperação de Acesso */}
        {mostrarRecuperar && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => {
              if (!carregandoRecuperar) {
                setMostrarRecuperar(false);
                setEmailRecuperar('');
                setMensagemRecuperar('');
                setNovaSenha('');
              }
            }}
          >
            <div 
              className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md"
              style={{ maxWidth: '500px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: '29px',
                  color: 'rgba(0, 0, 0, 0.8)',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}
              >
                Recuperar Acesso
              </h2>

              {!novaSenha ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setMensagemRecuperar('');
                  setCarregandoRecuperar(true);

                  try {
                    const response = await fetch('http://localhost:3000/recover-password', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: emailRecuperar,
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(data.error || 'Erro ao recuperar acesso');
                    }

                    setMensagemRecuperar(data.message);
                    if (data.newPassword) {
                      setNovaSenha(data.newPassword);
                    }
                  } catch (error: any) {
                    setMensagemRecuperar(error.message || 'Erro ao recuperar acesso. Tente novamente.');
                  } finally {
                    setCarregandoRecuperar(false);
                  }
                }}>
                  <div style={{ marginBottom: '18px' }}>
                    <label 
                      htmlFor="emailRecuperar"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '22px',
                        color: 'rgba(0, 0, 0, 0.8)',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="emailRecuperar"
                      value={emailRecuperar}
                      onChange={(e) => setEmailRecuperar(e.target.value)}
                      placeholder="Digite o seu email..."
                      required
                      disabled={carregandoRecuperar}
                      style={{
                        width: '100%',
                        height: '55px',
                        backgroundColor: '#DFECFB',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0 20px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '19px',
                        color: emailRecuperar ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
                        outline: 'none',
                        opacity: carregandoRecuperar ? 0.6 : 1
                      }}
                    />
                  </div>

                  {mensagemRecuperar && !novaSenha && (
                    <div style={{
                      backgroundColor: '#fee',
                      color: '#c33',
                      padding: '12px',
                      borderRadius: '4px',
                      marginBottom: '18px',
                      fontSize: '14px',
                      textAlign: 'center'
                    }}>
                      {mensagemRecuperar}
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarRecuperar(false);
                        setEmailRecuperar('');
                        setMensagemRecuperar('');
                      }}
                      disabled={carregandoRecuperar}
                      style={{
                        width: '120px',
                        height: '45px',
                        backgroundColor: '#ccc',
                        borderRadius: '4px',
                        border: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        lineHeight: '22px',
                        color: '#FFFFFF',
                        cursor: carregandoRecuperar ? 'not-allowed' : 'pointer',
                        opacity: carregandoRecuperar ? 0.6 : 1
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={carregandoRecuperar}
                      style={{
                        width: '180px',
                        height: '45px',
                        backgroundColor: carregandoRecuperar ? '#9ec5f0' : '#6EB9FF',
                        borderRadius: '4px',
                        border: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        lineHeight: '22px',
                        color: '#FFFFFF',
                        cursor: carregandoRecuperar ? 'not-allowed' : 'pointer',
                        opacity: carregandoRecuperar ? 0.7 : 1
                      }}
                    >
                      {carregandoRecuperar ? 'Enviando...' : 'Recuperar'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{
                    backgroundColor: '#dfd',
                    color: '#3a3',
                    padding: '16px',
                    borderRadius: '4px',
                    marginBottom: '24px',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}>
                    {mensagemRecuperar}
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <label 
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '22px',
                        color: 'rgba(0, 0, 0, 0.8)',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Sua nova senha:
                    </label>
                    <div style={{
                      width: '100%',
                      height: '55px',
                      backgroundColor: '#DFECFB',
                      border: '2px solid #6EB9FF',
                      borderRadius: '4px',
                      padding: '0 20px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 700,
                      fontSize: '18px',
                      lineHeight: '55px',
                      color: '#6EB9FF',
                      textAlign: 'center',
                      letterSpacing: '2px'
                    }}>
                      {novaSenha}
                    </div>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'rgba(0, 0, 0, 0.6)',
                      marginTop: '8px',
                      textAlign: 'center'
                    }}>
                      Anote esta senha e altere-a após fazer login.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setMostrarRecuperar(false);
                        setEmailRecuperar('');
                        setMensagemRecuperar('');
                        setNovaSenha('');
                      }}
                      style={{
                        width: '180px',
                        height: '45px',
                        backgroundColor: '#6EB9FF',
                        borderRadius: '4px',
                        border: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        lineHeight: '22px',
                        color: '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;