// 1. Configuración del Contrato

const contractAddress = "Ingresar Dirección del Contrato Aquí";

const contractABI = [
    "function depositarPago() public",
    "function confirmarEntrega() public"
];

let provider;
let signer;
let contract;

const btnConnect = document.getElementById('btnConnect');
const btnDepositar = document.getElementById('btnDepositar');
const btnConfirmar = document.getElementById('btnConfirmar');
const statusMsg = document.getElementById('statusMsg');

// 2. Conectar Billetera
async function conectarWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            
            document.getElementById('walletAddress').innerText = "Conectado: " + accounts[0];
            btnConnect.disabled = true;
            btnDepositar.disabled = false;
            btnConfirmar.disabled = false;
        } catch (error) {
            console.error("Error conectando wallet:", error);
            statusMsg.innerText = "Error al conectar MetaMask.";
        }
    } else {
        alert("Instala MetaMask!");
    }
}

// 3. Comprador: Depositar Pago
async function depositar() {
    try {
        statusMsg.innerText = "Procesando depósito... Confirma en MetaMask.";
        const tx = await contract.depositarPago();
        await tx.wait();
        statusMsg.innerText = "¡Fondos retenidos con éxito!";
        statusMsg.style.color = "green";
    } catch (error) {
        console.error(error);
        statusMsg.innerText = "Transacción fallida. ¿Aprobaste los tokens en Remix?";
        statusMsg.style.color = "red";
    }
}

// 4. Oráculo: Confirmar Entrega
async function confirmar() {
    try {
        statusMsg.innerText = "Confirmando entrega... Confirma en MetaMask.";
        const tx = await contract.confirmarEntrega();
        await tx.wait();
        statusMsg.innerText = "¡Entrega confirmada y pago liberado al vendedor!";
        statusMsg.style.color = "green";
    } catch (error) {
        console.error(error);
        statusMsg.innerText = "Transacción fallida. ¿Estás usando la wallet del Oráculo?";
        statusMsg.style.color = "red";
    }
}

btnConnect.addEventListener('click', conectarWallet);
btnDepositar.addEventListener('click', depositar);
btnConfirmar.addEventListener('click', confirmar);