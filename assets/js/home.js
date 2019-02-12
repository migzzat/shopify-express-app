var shop = new URL(window.location.href).searchParams.get("shop");

document.getElementById("btn-submit").onclick = function(ev){
   if(shop){
    window.location.href = `http://pushbots-shopify-app.herokuapp.com/shopify/install?shop=${shop}`;
   }   
};