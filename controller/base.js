
function Base(){
    this.post=function(req,res){
        res.reply('Hola!');
    }
    this.get=function(req,res){
        res.reply('get!');
    }
}


module.exports = new Base();