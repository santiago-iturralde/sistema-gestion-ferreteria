import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
  ) {}

  // 1. CREAR
  create(createClienteDto: CreateClienteDto) {
    const nuevo = this.clienteRepo.create(createClienteDto);
    return this.clienteRepo.save(nuevo);
  }

  // 2. LISTAR (Ordenados por nombre)
  findAll() {
    return this.clienteRepo.find({ order: { nombre_completo: 'ASC' } });
  }

  // 3. BUSCAR UNO
  findOne(id: number) {
    return this.clienteRepo.findOneBy({ id_cliente: id });
  }

  // 4. ACTUALIZAR DATOS
  update(id: number, updateClienteDto: UpdateClienteDto) {
    return this.clienteRepo.update(id, updateClienteDto as any);
  }

  // 5. BORRAR
  async remove(id: number) {
    return await this.clienteRepo.delete(id);
  }

  // NUEVO: REGISTRAR PAGO (Baja la deuda)
  async registrarPago(id: number, monto: number) {
    const cliente = await this.findOne(id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }
    
    // Restamos el monto a la deuda
    // (Usamos Number para asegurar que no concatene strings)
    cliente.saldo_deudor = Number(cliente.saldo_deudor) - Number(monto);
    
    // Opcional: Evitar saldo negativo si paga de más (o dejarlo como saldo a favor)
    // if(cliente.saldo_deudor < 0) cliente.saldo_deudor = 0;

    return this.clienteRepo.save(cliente);
  }
}