<?php
require 'repository.php';
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

$ctxt = new DataBase();
if(isset($_GET['Key']))
{
    
    switch ($_GET['Key']) {
        case 'get-news':
            echo json_encode($ctxt->getNews($_GET['Limit']));
            break;
        case 'get-questions':
            echo json_encode($ctxt->getQuestions($_GET['Limit']));
            break;
        case 'get-docs':
            echo json_encode($ctxt->getDocs());
            break;
        case 'get-apps':
            echo json_encode($ctxt->getApps($_GET['Login'], $_GET['Password']));
            break;
        case 'get-contacts':
            echo json_encode($ctxt->getContacts());
            break;
            
        case 'get-vacancies':
            echo json_encode($ctxt->getVacancies());
            break;
        case 'get-important-docs':
            echo json_encode($ctxt->getImportantDocs());
            break;
        case 'get-type-docs':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->getTypeDocs($b));
            break;
        case 'get-doc-types':
            echo json_encode($ctxt->getDocTypes($_GET['Info']));
            break;
        case 'get-prop':
            echo json_encode($ctxt->getProp($_GET['Name']));
            break;
        case 'get-rates':
            echo json_encode($ctxt->getRates($_GET['Type']));
            break;
        case 'get-props':
            echo json_encode($ctxt->getProps());
            break;
        case 'search':
            echo json_encode($ctxt->search($_GET['SearchString']));
            break;
        case 'add-app':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->addApp($b));
            break;
        case 'add-news':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->addNews($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'update-url':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->updUrl($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'add-doc-type':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->addDocType($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'update-doc-type':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->updateDocType($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'add-doc':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->addDoc($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'add-question':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->addQuestion($_GET['Login'], $_GET['Password'], $b));
        case 'enter-admin':
            echo json_encode($ctxt->enterAdmin($_GET['Login'], $_GET['Password']));
            break;
        case 'update-prop':
            echo json_encode($ctxt->updateProp($_GET['Login'], $_GET['Password'], $_GET['Id'], $_GET['Value']));
            break;
        case 'update-news':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->updateNews($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'update-doc':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->updateDoc($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'update-question':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->updateQuestion($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'remove-item': 
            echo json_encode($ctxt->removeItem($_GET['Login'], $_GET['Password'], $_GET['Id'], $_GET['Table']));
            break;
        
        case 'remove-new': 
            echo json_encode($ctxt->removeNew($_GET['Login'], $_GET['Password'], $_GET['Id'], $_GET['Images']));
            break;
            
        case 'add-contact':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->addContact($_GET['Login'], $_GET['Password'], $b));
            break;
            
        case 'update-contact':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->updateContact($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'add-vacancy':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->addVacancy($_GET['Login'], $_GET['Password'], $b));
            break;
            
        case 'update-vacancy':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->updateVacancy($_GET['Login'], $_GET['Password'], $b));
            break;
        case 'add-price':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->addPrice($_GET['Login'], $_GET['Password'], $b));
            break;
            
        case 'update-price':
            $b = json_decode(file_get_contents('php://input'), true);
            echo json_encode($ctxt->updatePrice($_GET['Login'], $_GET['Password'], $b));
            break;
            
        case 'upload-file':
            $inp = json_decode(file_get_contents('php://input'), true);
            echo json_encode(array($ctxt->uploadFile($_GET['Login'], $_GET['Password'], $_GET['Id'], $_FILES, $_GET['Type'])));
            break;
        
        default:
            echo "Введенный ключ несуществует";
        
    }
    
}
else
{  
    echo "Введенные данные некорректны";
}
?>