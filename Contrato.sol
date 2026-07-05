// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interfaz para usar Tokens ERC-20
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract DeliverySeguro {
    // Participantes
    address public comprador;
    address public vendedor;
    address public oraculoTracking;
    
    IERC20 public tokenPago;
    uint256 public precioArticulo;
    
    // Estado
    bool public fondosDepositados;
    bool public paqueteEntregado;

    // Eventos
    event PagoRetenido(address comprador, uint256 monto);
    event PagoLiberado(address vendedor, uint256 monto);

    constructor(address _token, address _vendedor, uint256 _precio, address _oraculo) {
        comprador = msg.sender;
        vendedor = _vendedor;
        oraculoTracking = _oraculo;
        tokenPago = IERC20(_token);
        precioArticulo = _precio;
    }

    // Función 1: El comprador deposita los tokens y quedan bloqueados
    function depositarPago() public {
        require(msg.sender == comprador, "Solo el comprador puede depositar");
        require(!fondosDepositados, "El pago ya fue depositado");

        require(tokenPago.transferFrom(msg.sender, address(this), precioArticulo), "Fallo la transferencia");
        
        fondosDepositados = true;
        emit PagoRetenido(msg.sender, precioArticulo);
    }

    // Función 2: El oráculo (Empresa de envíos) confirma la entrega y libera el pago
    function confirmarEntrega() public {
        require(msg.sender == oraculoTracking, "Solo el oraculo puede confirmar la entrega");
        require(fondosDepositados, "No hay fondos retenidos");
        require(!paqueteEntregado, "El paquete ya fue entregado");

        paqueteEntregado = true;
        
        // El contrato le paga al vendedor
        require(tokenPago.transfer(vendedor, precioArticulo), "Fallo el pago al vendedor");
        
        emit PagoLiberado(vendedor, precioArticulo);
    }
}