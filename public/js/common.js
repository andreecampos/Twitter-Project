//6.5 Adding a common javascript file
//6.6 getting the entered text from the textbox
//6.6 post button will fire when user  writee in  text area
//keyup  means when the key on  your keyboard is comes up, whne it is pressed
$("#postTextarea, #replyTextarea").keyup(event => {
    const textbox = $(event.target);
    const value = textbox.val().trim();
    //--------11.3  Enabling the submit reply button when the user types
    const isModal = textbox.parents(".modal").lenght == 1;

    //6.7 Enabling the submit button when the  user types
    const submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

    if(submitButton.lenght == 0) return alert("No submit button found");
    //6.7 if  the  value  is empty make it disabled so set the disabled property to true 
    if(value == ""){ 
        submitButton.prop("disabled", true);
        return;
    }
    //6.7 if  the  value  is NOT empty make it disabled so set the disabled property to true 
    submitButton.prop("disabled", false);

})
//7.1 Adding a click handler to the post button #submitPostButton is the id
$("#submitPostButton").click(()=>{
    const button = $(event.target);
    const textbox = $("#postTextarea");

    const data = { //7.1 the data we are want to send with this request
        content: textbox.val()
    }
    //7.1 we are going to submit this post with ajaz request, which will send the data to  teh server
   
    $.post("/api/posts", data, postData =>{
       //7.7 we  call the function
        const html = createPostHtml(postData);
        //7.7 add html in the page(look home for the conteiner .postsconteiner).
        //7.7 we use prepend not append because,append adds it to the end whereas prepend adds it to the front(top of the page)
        $(".postsConteiner").prepend(html);
        //7.7 clear the text box
        textbox.val("");
        button.prop("disabled", true)

    })
})
//-------11.4 Makinh the request
$("#replyModal").on("show.bs.modal",(event)=>{
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $(document).ready(()=>{
        //------- Getting posts from the database------------
        $.get("/api/posts/" + postId, results =>{
            //outputPosts(results, $(".postsContainer"))
            console.log(results);
        
     
         })
    })
})


//------------- 9.2 Like button click handler ---------
$(document).on("click",".likeButton",(event)=>{
    const button = $(event.target); //9.3 get the elemeent that was clipped
    const postId = getPostIdFromElement(button); //9.3 put the function that we did down
     //----------9.5 Making a PUT request ---------
     if(postId === undefined) return;
    //9.5 we submit a ajax request
    $.ajax({
        //-----------9.6 Checking if if the user has already like the post ------------
        url:`/api/posts/${postId}/like`,
        type:"PUT",
        success:(postData) =>{//this is the block that will get called when this ajax call returns successfully
                //console.log(postData.likes.length);
            //-------9.10 Updating the button to show the new number of likes-------
            button.find("span").text(postData.likes.length || "");
            //----------- 9.11 Passing the user logged in info to the client-------
            //----------- 9.12 Changing button colour when post is liked -------
            if(postData.likes.includes(userLoggedIn._id)){//9.12 if the array does include
                button.addClass("active");
            }else {
                button.removeClass("active");
            }

        } 
    })
})
//---------------10.1 Setting up the retweet route --------
$(document).on("click",".retweetButton",(event)=>{
    const button = $(event.target); 
    const postId = getPostIdFromElement(button); 
    
     if(postId === undefined) return;
    
    $.ajax({
       
        url:`/api/posts/${postId}/retweet`,
        type:"POST", //10.1 a retweet is essentially creating a new post tha is why we use POST
        success:(postData) =>{
            console.log(postData);
           // button.find("span").text(postData.likes.length || "");
            
           // if(postData.likes.includes(userLoggedIn._id)){
               // button.addClass("active");
            //}else {
               // button.removeClass("active");
           // }

        } 
    })
})

//-----------12.1 Sending the user to the posts page on click-------
$(document).on("click", ".post", (event) =>{
    //12.1 get the post id first
    const element = $(event.target); 
    const postId = getPostIdFromElement(element ); 

    if(postId !== undefined && !element.is("button")){
        window.location.href = '/posts/' + postId;
    }
});

//9.3 we did a function
function getPostIdFromElement(element){
    const idRoot = element.hasClass("post");
    const rootElement = idRoot == true ? element : element.closest(".post");//9.3 conditional operator
    const postId = rootElement.data().id;  
    
    if(postId === undefined) return alert("post id undefined");
    return postId;
}

//7.2 ----------- Rest API-------------------
/*We will use rest api  to handle all of the interaction between the database and the server */

//--------7.7 Handlind the response  from the server -------------   
//7.7 get the html with a function
function createPostHtml(postData) {
    //return postData.content;

//-----------7.8 Outputting the post content---------
//7.8 postData contains all the data from the post collection in the database
//7.8 postedBy contains the data for the user
    const postedBy = postData.postedBy; 

    //8.4 Populating the posted by data
    if(postedBy._id === undefined){
        return console.log("User object not populated");    
    }

    //7.9 we want to put the users name , firstName and LastName
    const displayName= postedBy.firstName + " " + postedBy.lastName; 
    //7.9 timestamp //8.6 we call the function of the time
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    //----------- 9.13 Showing correct button colour when page loads----------
    const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
     
// ------------------ 7.9 Outputting the  user info from  the post -------------
//-------7.10----7.11 ----7.12---CSS
//--------------9.3 Getting the post id from the clicked element----------
//9.3 add a  data attribute to the root object
    return `<div class='post' data-id='${postData._id}' > 
                    <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'> 
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}'class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                        <div class='postButtonContainer'>
                                <button data-toggle = 'modal' data-target='#replyModal'>
                                    <i class='fa-solid fa-message'></i>
                                </button>
                        </div>
                        <div class='postButtonContainer green'>
                                <button class='retweetButton'>
                                    <i class='fa-solid fa-retweet'></i>
                                </button>
                        </div>
                        <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='fa-solid fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                        </div>

                        </div>
                    </div>
                    </div>
            </div>`;
}

//-------------8.6 Calculating the timestamp of the posts -------------
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now"
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}