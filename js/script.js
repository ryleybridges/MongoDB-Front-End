$(document).ready(function(){
let serverKey;
let serverPort;
let editing = false;

  $.ajax({
    url: 'config.json',
    type: 'GET',
    dataType: 'json',
    success: function(keys){
      serverKey = keys['SERVER_URL'];
      serverPort = keys['SERVER_PORT'];
      getProductsData();
    },
    error: function(){
      console.log('cannot find config.json file, cannot run application');
    }
  });

  getProductsData = () => {
    $.ajax({
      url:  `${serverKey}:${serverPort}/allProducts`,
      type: 'GET',
      dataType: 'json',
      success: function(data){
        let products = data;
        for (var i = 0; i < products.length; i++) {
          $('#productList').append(`<li class="list-group-item d-flex justify-content-between align-items-center">
                              ${products[i].name}
                                  <div>
                                    <button class="btn btn-info">Edit</button>
                                    <button class="btn btn-danger">Remove</button>
                                  </div>
                              </li>`);
          }
      },
      error: function(){
        console.log('it is not working');
      }
    });
  }


  $('#addProduct').click(function(){
    event.preventDefault();
    // console.log('button has been clicked');
    let productName = $('.productName').val();
    let productPrice = $('.productPrice').val();
    if(productName === ''){
      console.log('please enter a thing');
    }else if(productPrice === ''){
      console.log('please enter a cost');
    }else {
      console.log(`${productName} costs $${productPrice}`);
      $.ajax({
        url: `${serverKey}:${serverPort}/product`,
        type: 'POST',
        data: {
            name: productName,
            price: productPrice
        },
        success: function(result){
          $('#productList').append(`<li class="list-group-item d-flex justify-content-between align-items-center">
                                ${result.name}
                                  <div>
                                  <button class="btn btn-info editBtn">Edit</button>
                                  <button class="btn btn-danger removeBtn">Remove</button>
                                  </div>
                                </li>`);
          $('.productName').val(null);
          $('.productPrice').val(null);
        },
        error: function(error){
          console.log(error);
          console.log('something went wrong');
        }
      });
    }
  });

  $('#contactButton').click(function(){
    event.preventDefault();
    let contactName = $('.contactName').val();
    let contactEmail = $('.contactEmail').val();
    let contactSubject = $('.contactSubject').val();
    let contactMessage = $('.contactMessage').val();
    if(contactName === ''){
      console.log('please enter a name');
    }else if(contactEmail === ''){
      console.log('please enter an email');
    }else if(contactSubject === ''){
      console.log('please enter a subject');
    }else if(contactMessage === ''){
      console.log('please enter a message');
    }else {
      $.ajax({
        url: `${serverKey}:${serverPort}/contact`,
        type: 'POST',
        dataType: 'json',
        data: {
            name: contactName,
            email: contactEmail,
            subject: contactSubject,
            message: contactMessage
        },
        success: function(result){
          console.log(result);
        },
        error: function(error){
          console.log(error);
          console.log('something went wrong');
        }
      });
    }
  });

  $(document).on('click', '.btn-info', function(){
    const id = $(this).parents('li').data('id');
    $.ajax({
      url: `${serverKey}:${serverPort}/product/${id}`,
      type: 'GET',
      dataType: 'json',
      success:function(id){
        console.log(id);
      },
      error:function(error){
        console.log(error);
        console.log('something went wrong');
      }
    });
    // event.preventDefault();
    // $.ajax({
    //   url: `${serverKey}:${serverPort}/allProducts/${id}`,
    //   type: 'GET',
    //   dataType: 'json',
    //   success: function(result){
    //     console.log(result);
    //   },
    //   error: function(error){
    //     console.log(error);
    //     console.log('something went wrong');
    //   }
    // });
  });

});
