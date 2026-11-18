// src/usuarios/entities/usuario.entity.ts
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { compare, genSalt, hash } from 'bcryptjs';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 25 })
  telefono: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  // Protegido con select: false para que no se devuelva por accidente en consultas GET
  //@Column({ type: 'varchar', length: 250, select: false })
  //clave: string;

  @Column({ type: 'varchar', nullable: true }) // 👈 Asegúrate de que tenga nullable: true si hay datos viejos
  clave: string;
  
  @Column({
    type: 'enum',
    enum: ['vendedor', 'comprador'],
    default: 'comprador',
  })
  rol: 'vendedor' | 'comprador';

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.clave && !this.clave.startsWith('$2a$')) {
      const salt = await genSalt();
      this.clave = await hash(this.clave, salt);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return compare(plainPassword, this.clave);
  }
}