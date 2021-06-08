const express = require("express");
const app = express();
const fs = require('fs');
app.use(express.json());
const {v4:uuidv4 } = require("uuid");
const port = 5000;

const carros = require('./dataBase/carros.json')


app.get('/carros',(req,res)=>res.json(carros))

app.get('/carros/:id', (req,res)=>{
    const{id} = req.params;
    const carrosEncontrado= carros.find(carro =>carro.id===id)

    if(!carrosEncontrado){
        return res.status(400).json({mensagem:`Carro com id:${id} não encontrado`})
    }
    return res.json(carrosEncontrado)
})

app.post('/carros',(req,res)=>{
    const {nome, ano, fabricante} = req.body

    const carroNovo = {
        id: uuidv4(),
        nome,
        ano,
        fabricante
    }
    carros.push(carroNovo);
    fs.writeFileSync('./dataBase/carros.json', JSON.stringify(carros));
    res.status(200).json(carroNovo).send();
})

app.put('/carros/:id', (req,res)=>{
    const {id} = req.params;
    const {nome, ano, fabricante} = req.body
    const carrosEncontrado= carros.find(carro =>carro.id===id)

    if(!carrosEncontrado){
        return res.status(400).json({mensagem:`Carro com id:${id} não encontrado`})
    }

    carrosEncontrado.nome = nome;
    carrosEncontrado.ano = ano;
    carrosEncontrado.fabricante = fabricante;

    fs.writeFileSync('./dataBase/carros.json', JSON.stringify(carros));
    res.status(200).json(carrosEncontrado).send();

})
app.delete('/carros/:id',(req,res)=>{
    const {id} = req.params;
    const carrosEncontrado= carros.findIndex(carro =>carro.id===id);

    if(carrosEncontrado == -1){
        return res.status(400).json({mensagem:`Carro com id:${id} não encontrado`})
    }
    carros.splice(carrosEncontrado,1);
    return res.status(204).send();
})

app.listen(port, () =>{
    console.log(`Server is up and running on port ${port}`)
})