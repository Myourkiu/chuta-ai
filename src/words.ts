// Palavras que podem ser sorteadas (substantivos, adjetivos e verbos comuns).
const ANSWERS_RAW = `
abrir acaso aceno ácido acima açude adeus afeto agora aguda agudo ainda alado álbum alçar algum aliás altar
aluno amado âmago ambos amigo amora ampla amplo andar anexo anual anzol apelo apoio aquém árabe arara areia
arena aroma arroz asilo assar astro atlas átomo atrás atriz atual audaz autor avião aviso axila azedo
babar bacia bagre baixo balde balão bambu banal banco banda banho barba barco barro bater beber beijo berço
besta bicho bingo birra blusa bolha bolsa bolso bomba borda braço brado brasa bravo breve briga brisa broca
bruma bruxa burro busca cabra caber cacau cacto caixa calda caldo calma calmo calor calvo campo canal canoa
canto capaz capim carga carne carro carta casal casca casco caspa causa cavar celta censo cerca cerne certo
cervo cesta chapa chave chefe cheio chuva cifra cinco cinto cinza circo cisne civil claro clima clone cobra
coçar coisa colar combo comer comum conto corda corpo corte coral couro couve cravo creme crise cruel cueca
culpa cupom curar curso curto curva dados dança dardo dedal deusa dever dieta digno disco ditar dizer dobra
doido dólar domar dorso drama droga duelo dupla duplo durar dúzia ébano elite enfim entre época ereto errar
espia estar etapa ética exame exato êxito extra facão fácil faixa falar falha falso falta farda farol farsa
fatal fatia fauna favor fazer febre feira feito feliz fenda feroz festa fibra ficar filho filme final firma
firme fisco fluir fluxo focar fogão folga folha fonte força forno forte fosso frade frase freio frevo fruta
fruto fugir fumar fundo fungo furar fúria furor fuzil gaita galho ganso garfo garoa garra gasto gemer gênio
gente gesso gesto girar globo golfe golpe gordo gorro gosto graça grade grama grato grave graxa greve grilo
gripe grito grude grupo gruta guiar hábil harpa haste hiato hiena honra hotel humor ícone ideal idade ideia
idoso imune índio inato irmão janta jarra jeito jogar jovem juízo junho julho junto jurar justo lábio laçar
lacre lagoa lança lápis largo larva laser latão latir lavar legal leite leito lenço lenda lento leque lerdo
lesma letra levar libra licor lidar líder limão limbo limpo lince linda lindo linha lírio litro livre livro
local lombo longe lotar louco louça lousa lucro lugar lunar lutar macio magia magro maior malha malte mamãe
mamão manga manha manhã mania manso manta manto marca março marte massa matar mecha medir meigo melão menor
menta mente mesmo metal metro mexer milho minha miolo misto miúdo moeda moita molde molho monge monte morar
morno morro morte mosca motor móvel mudar muito multa mundo mural museu nadar naipe nariz natal nação naval
navio negar nervo nicho ninho nível noite noiva noivo norma norte nossa nosso notar nozes nunca nuvem obeso
obter odiar olhar ombro ontem opaco opção optar órgão ostra outro ouvir pacto padre pagar pagão palco palha
palma panda papel parar pardo parto passo pasta pasto pátio pausa pavão pavor pedal pedir pedra peito peixe
penca pente perda perna perto pesar pesca piada piano picar pilha pinça pinho pinta pirão pisar pista placa
plano pleno pluma poção pódio poema poeta polar polvo pomar pombo ponte ponto porco porta porte posse poste
pouco prado praga praia prata prato prazo prece preço prego preso preto prima primo prosa prova pudim pular
pulga pulso punho puxar quase queda quilo quina radar raiva ralar rampa rapaz razão reino relva remar renda
resto rever rezar rigor rimar rival rocha rodar rolha rolar rombo rosto roubo roupa rubor rugir ruído rumor
rural sábio sabor sacar safra saída salão salsa salto samba santo saque sarau sauna saúde seiva selar selva
senha senso série servo setor sexto sinal sítio sobra sócio solar sonho sopro sorte suave subir sujar sumir
surdo surfe susto taiga talco tampa tango tapar tarde tecer tecla telão tempo tenda tenso termo terno terra
teste texto tigre tinta tirar tocar todos tomar tonto topar torre torta torto tosse total touca touro traço
trago traje trama trapo trevo trigo tripa troca troco tropa trono truta tumba turbo turma turno úmido único
união usado usina usual vagão vagar valer valor valsa vapor varal vazio veado velha velho veloz venda vento
verão verbo verde verme verso vespa vetor vidro vigor vilão vinho viola virar visão vista vital viver volta
votar vulgo xampu zebra zelar zinco zumbi ajuda apito baile banjo barão barra berro bloco bonde bossa botar
brejo broto cacho canil capuz cargo carpa chalé chama chope choro ciclo cílio ciúme coala coice conde corvo
crepe cupim dente diabo dique ecoar esqui fecho ferro fiapo flora fobia forca fosco fraco frota funil galão
garça gêmeo ginga golfo guizo homem horda horta igual ímpar impor jaula jejum laudo lazer lebre linho lótus
macho magma manco médio menos mirim molar moral morsa murro ninar nobre noção oásis oeste órfão ótimo pampa
pavio pegar pequi pinga pique pizza pólen porão pouso pudor quati rádio rasgo recuo refém reger régua ritmo
rosca rouco sabão sabiá sagaz saldo sigla sobre sogra sogro solto sonda sótão sushi tacho telha temor tênis
tédio tiara tocha toque tosco trato treta trufa tutor uivar urubu vagem vasto vinil vírus viúva vulto zíper
aipim aveia ânimo antes assim canja caqui cedro caule cauda cosmo crivo dueto fiado filão forró genro grife
haver ileso lhama potro pinto quinze treze vinte cento sagui tórax testa brega chato chata parça porre piche
chute trave
`;

// Aceitas como chute, mas nunca sorteadas (conjugações, pronomes etc.).
const EXTRA_RAW = `
estou estão falou fazia ficou foram havia sabia seria sejam temos tenho tinha vamos viram vimos deram disse
posso podem devem quero achei falei fomos jogou jogue pensa pense saiba tente venha vejam chega chego comeu
bebeu andou entra achou gosta sinto minto tenta desse dessa deste desta nesse nessa neste nesta essas esses
estas estes todas muita pouca outra tanto tanta quais então mesma junta abriu ganha ganho perdi perde corre
corri fugiu morre morri nasci nasce dorme durmo chora canta pulou subiu desce desci olhei olhou vemos vendo
vindo feita visto fazem digam dizem fosse faria podia devia iria altos baixa cheia curta fraca gorda louca
magra azuis olhos unhas costa memes reais leões anéis cores pães mães irmãs
`;

const ACCENTS: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c',
};

// Implementação própria em vez de String.normalize, que não é confiável no Hermes.
export function normalize(word: string): string {
  return Array.from(word.toLowerCase())
    .map((ch) => ACCENTS[ch] ?? ch)
    .join('');
}

const list = (raw: string) => raw.split(/\s+/).filter(Boolean);
const isWord = (w: string, len: number) => new RegExp(`^[a-z]{${len}}$`).test(w);

/** Forma acentuada de cada palavra conhecida, indexada pela forma sem acento. */
const accented = new Map<string, string>();
export const ANSWERS: string[] = [];
export const VALID = new Set<string>();

for (const w of list(ANSWERS_RAW)) {
  const n = normalize(w);
  if (!isWord(n, 5) || accented.has(n)) continue;
  accented.set(n, w.toLowerCase());
  ANSWERS.push(n);
  VALID.add(n);
}

for (const w of list(EXTRA_RAW)) {
  const n = normalize(w);
  if (!isWord(n, 5)) continue;
  VALID.add(n);
  if (!accented.has(n)) accented.set(n, w.toLowerCase());
}

/** Letras para exibir num chute já enviado, com acentos quando a palavra é conhecida. */
export function displayLetters(word: string): string[] {
  const letters = Array.from(accented.get(word) ?? word);
  return letters.length === 5 ? letters : Array.from(word);
}
