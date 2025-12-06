Jenkins is a continuous integration and continuous delivery/deployment (CI/CD) server. When developers commit code changes to a repository, Jenkins can automatically pull those changes, compile the code, run tests, and deploy the application if everything passes.

## Getting code execution

1. 'Manage Jenkins' -> 'Script Console' -> `println "<cmd>".execute().text`
2. (noisy, might be blind) 'Create item' -> 'Freestyle Project' -> go to 'Build Environment' at the top -> 'Build' -> 'Add build step' -> 'Execute shell' -> type whatever command u want, executes when u build