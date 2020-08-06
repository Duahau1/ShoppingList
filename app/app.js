const app = angular.module("app",['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        templateUrl:"/app/views/output.html",
        controller:"ctrl"
    })
    .when("/additem",{
        templateUrl:"/app/views/inputitem.html",
        controller:"ctrl"

    })
    .when("/additem/:id",{
        templateUrl:"/app/views/inputitem.html",
        controller:"ctrl"
    })
    .otherwise({ redirectTo: '/'});
    
});
app.controller("ctrl",function($scope,groceries,$location,$routeParams){
    $scope.food = groceries.food;
    
    if($routeParams.id){
        $scope.newitem = Object.assign({},groceries.find($routeParams.id)[0]);
    }
    else{
        $scope.newitem={_id:1,completed:false,name:"",quantity:1};
    }

    // Save new Item and Update proper Item
    $scope.save = function(){
        groceries.save($scope.newitem).then(function(re){
            console.log(re);
            if(re.config.method=='PATCH'){
                let result= $scope.food.filter((value => value._id == re.config.data.id));
                console.log(result);
                result[0].name=re.config.data.name;
                result[0].quantity = re.config.data.quantity;
            }
            else{
            $scope.food.push(re.data);
            }
            console.log($scope.food);

            $location.url("/");
         })
         .catch(function(err){
             console.log(err);
         });
    }

    //Delete an item 

    $scope.removeItem = function(entry){
        groceries.removeItem(entry);
    }
    $scope.toggle = function(entry){
        groceries.toggle(entry);
    }
    
    $scope.$watch(function(){return groceries.food},
    function(newVal,oldVal){
        $scope.food = newVal;
    })
    
})

app.service("groceries",function($http){
    var groceries={}
    
    groceries.find = function(id){
       let result= groceries.food.filter((value=> value._id == id));
       return result;
    }
    groceries.food =[];

    //Get all the shopping items
     $http.get("http://localhost:3000/")
     .success(function(data){
        groceries.food=data;
    })
    .error(function(err){
        console.log(err);
    })
    
    // Delete a product in the shopping list
    groceries.removeItem = function(entry){
        var index = groceries.food.indexOf(entry);
        console.log(entry._id);
        groceries.food.splice(index,1);
        $http.delete(`http://localhost:3000/${entry._id}`,{
            params: {id: entry._id}
        }).then(()=>{
            console.log("Success");
        })
    }

    //Toggle the state of a product
    groceries.toggle = function(entry){
        entry.completed = !entry.completed;
        $http({
            url:"http://localhost:3000/complete",
            method:'PATCH',
            data:{
                id: entry._id,
                completed: entry.completed 
            }
        }).then((result)=> console.log(result)).catch(err=>console.log(err));
    }
    
    // Save the edits or Add a new item to the list
    groceries.save = function(entry){
        var update = groceries.find(entry._id);
        if(update.length > 0){
           return $http({
                url:'http://localhost:3000/',
                method:'PATCH',
                data:{
                    id:entry._id,
                    name:entry.name,
                    quantity:entry.quantity
                }
           })
        }
        else{
        return $http({
            url:'http://localhost:3000/',
            method:'POST',
            data:{
                name:entry.name,
                quantity:entry.quantity
            }
        })
       
        }
    }
    return groceries;
})


