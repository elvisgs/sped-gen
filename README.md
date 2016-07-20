# SPED-Gen
[![Build Status](https://travis-ci.org/elvisgs/sped-gen.svg?branch=master)](https://travis-ci.org/elvisgs/sped-gen)
> Gerador de código baseado em metadados do SPED - Sistema Público de Escrituração Digital.

## Instalação
```shell
$ npm install sped-gen
```

## Uso
```javascript
var spedGen = require('sped-gen');

spedGen(/*Object*/options);
```

## Opções
- (*String*) **layoutSped**: Os valores possíveis são `fiscal` ou `contrib` (obrigatório, *default*: fiscal)
- (*String*) **template**: String contendo um template handlebars (obrigatório se templateFile não especificado)
- (*String*) **templateFile**: Arquivo de template handlebars (obrigatório se template não especificado)
- (*String|Function*) **fileName**: String ou função que retorna o nome do(s) arquivo(s) a ser(em) gerado(s). Pode ser um template handlebars que será processado com os metadados (obrigatório)
- (*Boolean*) **singleFile**: Será gerado um único arquivo? (*default*: false)
- (*Function*) **filter**: Função para filtrar (excluir) registros da geração (*default*: `(registro) => true`)
- (*Function*) **handler**: Função para alterar um registro antes de ser passado para o template. Pode ser usada, por ex., para adicionar campos calculados ao registro (*default*: `() => {}`)
- (*Function*) **mapper**: Função para transformar um registro antes de ser passado para o template (*default*: `(registro) => registro`)
- (*Function*) **writer**: Função que define onde o template processado será escrito. Recebe como parâmetros o template processado, o registro e as opções (*default*: multiFileWriter)
- (*Object*) **aditionalFields**: Campos adicionais incluídos nos registros antes de passá-los ao template (*default*: {})

Para entender melhor as opções consulte os exemplos.

## Formato dos metadados
Abaixo pode-se ver um exemplo de metadado do registro 0190. Para saber o significado de alguns campos (por ex. obrigatorio, tipo), consulte a documentação do SPED.

*Obs*: o campo REG da posição 1 sempre é excluído.

```javascript
{
  "id": "0190",
  "nivel": "2",
  "ocorrencia": "2",
  "obrigatorio": "0",
  "descricao": "Unidade de Medida",
  "campos": [
    {
      "posicao": "2",
      "id": "UNID",
      "tipo": "C",
      "tamanho": "6",
      "obrigatorio": "1",
      "descricao": "Código da unidade de medida"
    },
    {
      "posicao": "3",
      "id": "DESCR",
      "tipo": "C",
      "tamanho": "",
      "obrigatorio": "1",
      "descricao": "Descrição da unidade de medida"
    }
  ],
  "pai": "0001",
  "referenciadoPor": [
    {
      "regId": "0200",
      "campoId": "UNID",
      "campoRef": "UNID_INV"
    }
  ]
}
```

### Campos adicionais incluídos por padrão nos metadados
O seguintes campos são incluídos a cada metadado de registro na sua raiz. Podem ser acessados no template apenas com seu nome.
- **bloco**: Bloco do registro (primeiro caracter do id do registro)
- **abertura**: Registro é de abertura de bloco? (registros *001)
- **encerramento**: Registro é de encerramento de bloco? (registros *990 e *999)
- **layoutSped**: Layout SPED informado nas opções

## Funções e constantes utilitárias

### No módulo

```javascript
var spedGen = require('sped-gen');

spedGen.layouts.{FISCAL|CONTRIB} // layouts permitidos
spedGen.utils // funções utilitárias sobre registros
spedGen.DEFAULT_OPTIONS // pode ser usada para sobrescrever as opções default
spedGen.registerHelper // registra um helper do handlebars
```

### Nos templates (helpers do handlebars)
- **camelize**(*String*): Converte a string para camel case. Por ex.: field_name -> fieldName
- **getter**(*String*): Obtém java getter. Por ex.: field_name -> getFieldName
- **setter**(*String*): Obtém java setter. Por ex.: field_name -> setFieldName
- **getJavaType**(*Object*): Obtém um java type a partir de um metadado de campo do SPED
- **getBloco**(*String*): Obtém o bloco (primeiro caracter do id do registro)
- **pascalCase**(*String*): Converte a string para pascal case. Por ex.: field_name -> FieldName
- **lcase**(*String*): Converte a string para lowercase
- **ucase**(*String*): Converte a string para uppercase

A utilização de alguns desses helpers pode ser vista nos exemplos.

## TODO
- Permitir outras template engines