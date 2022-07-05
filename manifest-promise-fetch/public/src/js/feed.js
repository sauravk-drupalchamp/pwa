var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if(defferedPrompt){
    defferedPrompt.prompt();
    defferedPrompt.userChoice.then(function(userChoiceResult){
      console.log(userChoiceResult.outcome)
      if(userChoiceResult.outcome === 'dismissed'){
        console.log("User cancelled")
      }else{
        console.log("User added to homescreen")
      }
      defferedPrompt = null;
    })
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
