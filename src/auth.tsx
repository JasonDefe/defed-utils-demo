
export default function Auth() {

  const closeWindow = () => { // close the current tab page
    console.log('close current window');
    window.opener = null;
    window.open('', '_self')
    window.close();
  }


  //接收授权回调信息code state
  console.log('auth callback')
  
  const callback_fragment = new URLSearchParams(window.location.search.slice(1))
  const code = callback_fragment.get('code')
  const state = callback_fragment.get('state')
  console.log('callback+response', code, state)
  if (code) {
    closeWindow()
  } else {
    
  }

  

  return (
    <div className="auth">
    </div>
  );
}

