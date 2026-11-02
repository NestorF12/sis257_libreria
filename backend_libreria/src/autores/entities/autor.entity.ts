import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn 
} from 'typeorm';

@Entity('autores')
export class Autor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nacionalidad: string;
}