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
        for (var i = 0; i < data.length; i++) {
          $('#productList').append(`<li class="list-group-item d-flex justify-content-between align-items-center" data-id=${data[i]._id}>
                              ${data[i].name}
                                  <div>
                                    <button class="btn btn-info editBtn">Edit</button>
                                    <button class="btn btn-danger removeBtn">Remove</button>
                                  </div>
                              </li>`);
          }
      },
      error: function(){
        console.log('it is not working');
      }
    });
  }

  $('#productList').on('click', '.editBtn', function(){
    event.preventDefault();
    const id = $(this).parent().parent().data('id');
    console.log(id);
    console.log('button has been clicked');
    $.ajax({
      url: `${serverKey}:${serverPort}/product/${id}`,
      type: 'GET',
      dataType: 'json',
      success:function(product){
        console.log(product);
        $('.productName').val(product['name']);
        $('.productPrice').val(product['price']);
        $('#productID').val(product['_id']);
        $('#addProduct').text('Edit Product').addClass('btn-warning');
        $('#heading').text('Edit Product');
        editing = true;
      },
      error:function(err){
        console.log(err);
        console.log('it is not working');
      }
    });
  });

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
      if(editing === true){
        const id = $('#productID').val();
        $.ajax({
          url: `${serverKey}:${serverPort}/editProduct/${id}`,
          type: 'PATCH',
          data: {
            name: productName,
            price: productPrice
          },
          success:function(result){
            console.log(`Edited ${productName} to be $${productPrice}`);
            $('.productName').val(null);
            $('.productPrice').val(null);
            $('#productID').val(null);
            $('#addProduct').text('Add Product').removeClass('btn-warning');
            $('#heading').text('Add Product');
            editing = false;
          },
          error:function(err){
            console.log(err);
            console.log('something went wrong');
          }
        });
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

});
