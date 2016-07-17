package br.com.sped.fiscal.entities.bloco0;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "reg_0150")
@Getter
@Setter
public class Reg0150 {

    @Id @GeneratedVaue
    private Long id;

    @Column(name = "cod_part")
    private String codPart;

    @Column(name = "nome")
    private String nome;

    @Column(name = "cod_pais")
    private String codPais;

    @Column(name = "cnpj")
    private String cnpj;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "ie")
    private String ie;

    @Column(name = "cod_mun")
    private String codMun;

    @Column(name = "suframa")
    private String suframa;

    @Column(name = "endereco")
    private String endereco;

    @Column(name = "num")
    private String num;

    @Column(name = "compl")
    private String compl;

    @Column(name = "bairro")
    private String bairro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", insertable = false, updatable = false)
    private Reg0001 reg0001;

    @OneToMany(mappedBy = "reg0150", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Reg0175> regs0175;

}