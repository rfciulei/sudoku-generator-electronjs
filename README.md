
  # Development 
  <ul>
  <li>before running npm start make sure to launch task with label "C/C++: g++.exe build active file". Ctrl+Shift+B is the default keyshorcut. Also, the development was done on windows only so far so make sure to have all the necesarry DLLs added to the executable if you want to run on another machine can use dumpbin to  see what DLLs it needs </li>
    <li>can control whether .cpp file is compiled for each pdf generation by changing the variable <code>compile = true</code> in main.js.<br>There's an issue to add this to env.js.</li>
  </ul>
  # Run 
  <ul>
   <li>npm install </li>
    <li>npm start ( if variable compile is set to true will use g++ to compile the c++ executable, else just do it manually and set it to false, until windows-build-tools will be supported ) </li>
  </ul>


