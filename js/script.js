$.ajax({
    url: 'http://localhost:3000/products',
    type: 'get',
    success: function(data){
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            $('#productList').append(`<li class="list-group-item d-flex justify-content-between align-items-center">
                                      ${data[i].name} - $${data[i].price}
                                      <div>
                                          <button class="btn btn-info">Edit</button>
                                          <button class="btn btn-danger">Remove</button>
                                      </div>
                                  </li>`)
        }
    },
    error:function(err){
        console.log(err);
    }
})


$('#addProduct').submit(function(){
    event.preventDefault();
    // console.log( $( this ).serializeArray() );
    if(($( this ).serializeArray()[0].value.length > 0) && ($( this ).serializeArray()[1].value.length > 0)){
        $.ajax({
            url: 'http://localhost:3000/products',
            type: 'post',
            data: {
                name: $( this ).serializeArray()[0].value,
                price: $( this ).serializeArray()[1].value,
            },
            success:function(result){
                $('#productList').append(`<li class="list-group-item d-flex justify-content-between align-items-center">
                                          ${result.name} - $${result.price}
                                          <div>
                                              <button class="btn btn-info">Edit</button>
                                              <button class="btn btn-danger">Remove</button>
                                          </div>
                                      </li>`)
                console.log(result);
            },
            error:function(error){
                console.log(error);
                console.log('cannot add product to databse');
            }
        })

    }

})
