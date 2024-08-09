# 1 - Execução do frontend
-Caso você não tenha a linha de comando do Angular instalado em sua máquina, execute o comando `npm install -g @angular/cli`, sem as aspas
-Executar na raiz do projeto frontend o comando `npm install`, sem as aspas;
-É possível executar o frontend (Angular) como uma aplicação separada do backend, ou junto do backend (através da geração do build do Angular);

# 1.1 - Execução separada do backend
-Checar no arquivo src/config.ts se urlBase está apontando para o caminho do backend. Caso não esteja, configurar o caminho corretamente;
-Executar `npm start`, sem as aspas, na pasta raiz do projeto frontend.

# 1.2 - Execução em conjunto com o backend
-Atribuir o valor "" para a variável urlBase no arquivo src/config.ts;
-Executar `npm run build`, sem as aspas;
-Após finalizar o comando `npm run build`, levar a pasta dist gerada para a raiz do backend.