<?php
require 'models.php';
class DataBase {
    //$this->db = new PDO('mysql:host=localhost;dbname=nomokoiw_portal;charset=UTF8','nomokoiw_portal','KESRdV2f');
    public $db;
    public function __construct()
    {
        //$this->db = new PDO('mysql:host=localhost;dbname=myblog;charset=UTF8','nlc','12345');
        $this->db = new PDO('mysql:host=localhost;dbname=ih654686_water;charset=UTF8','ih654686_ivan','M*WRpDl1');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    }

    public function uploadFile($l, $p, $pid, $files, $t){
        if($this->checkAdmin($l, $p)){
            //return $files;
            $img=$this->getImage($pid, $t);
            if($img){
                $this->removeFile($img);
            }
            $url = "http://vdknf.ru/water/";
            $n = basename($t."_".$pid);
            $column = 'Image';
            //$tid=ucfirst($t)."Id";
            $tid="Id";
            /*if($t='newsimage'){
                $tid="NewId";
            };*/
            $t .="s";
            
            if(file_exists("Files")){
                if($files['Data'] != null){
                    $n = basename($t."_".$pid."_".$collumn."_".$files['Data']['name']);
                    $d = "Files/$n";
                    if(move_uploaded_file($files['Data']['tmp_name'], $d)){
                        $s = $this->db->prepare("UPDATE $t SET Image=? WHERE $tid=?");
                        $s->execute(array($url.$d, $pid));
                        return($url.$d);
                    }else{
                        return($_FILES['Data']['tmp_name']);
                    }
                }else{
                    $result = array();
                    for ($i = 0; $i < count(array_keys($files)); $i++) {
                        $collumn = array_keys($files)[$i];
                        $n = basename($t."_".$pid."_".$collumn."_".$files[$collumn]['name']);
                        $d = "Files/$n";
                        if(move_uploaded_file($files[$collumn]['tmp_name'], $d)){
                            $s = $this->db->prepare("UPDATE $t SET $collumn=? WHERE $tid=?");
                            $s->execute(array($url.$d, $pid));
                            $result[$collumn] = $url.$d;
                        }else{
                            $result[$collumn] = "error";
                        }
                        
                    }
                    return $result;
                }
            }else{
                mkdir("Files");
                if($files['Data'] != null){
                    if(move_uploaded_file($files['Data']['tmp_name'], $d)){
                        $s = $this->db->prepare("UPDATE $t SET Image=? WHERE $tid=?");
                        $s->execute(array($url.$d, $pid));
                        return($url.$d);
                    }else{
                        return($_FILES['Data']['tmp_name']);
                    }
                }else{
                    $result = array();
                    for ($i = 0; $i < count(array_keys($files)); $i++) {
                        $collumn = array_keys($files)[$i];
                        if(move_uploaded_file($files[$collumn]['tmp_name'], $d)){
                            $s = $this->db->prepare("UPDATE $t SET $collumn=? WHERE $tid=?");
                            $s->execute(array($url.$d, $pid));
                            $result[$collumn] = $url.$d;
                        }else{
                            $result[$collumn] = "error";
                        }
                        
                    }
                    return $result;
                }
            }
            
            return false;
        }else{
            return null;
        }
    }

    public function updUrl($l, $p, $url){
        if($this->checkAdmin($l, $p)){
            $id = $url['Id'];
            unset($url['Id']);
            $a = $this->genUpdateQuery(array_keys($url), array_values($url), "newsimages", $id);
            $s = $this->db->prepare($a[0]);
            $s->execute($a[1]);
            return $a;
        }else{
            return null;
        }
    }
    
    public function getImage($id, $t){
        // $tid=ucfirst($t)."Id";
        $tid="Id";
        $t .="s";
        $s = $this->db->prepare("SELECT Image FROM $t WHERE $tid=?");
        $s->execute(array($id));
        return $s->fetch()['Image'];
    }

    private function genInsertQuery($ins, $t){
        $res = array('INSERT INTO '.$t.' (',array());
        $q = '';
        for ($i = 0; $i < count(array_keys($ins)); $i++) {
            $res[0] = $res[0].array_keys($ins)[$i].',';
            $res[1][]=$ins[array_keys($ins)[$i]];
            $q=$q.'?,';
            
        }
        $res[0]=rtrim($res[0],',');
        $res[0]=$res[0].') VALUES ('.rtrim($q,',').');';
        
        return $res;
        
    }
    private function genUpdateQuery($keys, $values, $t, $id){
        $res = array('UPDATE '.$t.' SET ',array());
        $q = '';
        for ($i = 0; $i < count($keys); $i++) {
            if($values[$i]!='now()'){
                $res[0] = $res[0].$keys[$i].'=?, ';
                $res[1][]=$values[$i];
            }
            else{
                $res[0] = $res[0].$keys[$i].'=now(), ';
            }
            
            
        }
        $res[0]=rtrim($res[0],', ');
        $res[0]=$res[0].' WHERE Id = '.$id;
        
        return $res;
        
    }
    
    private function removeFile($filelink){
        $path = explode('water/',$filelink);
        if($path[1]){
            unlink($path[1]);
        }
        
    }
    
    public function getNews($l){
        if($l == null){
            $sth = $this->db->query("SELECT * FROM news ORDER BY CreateDate DESC");
        }
        else{
            $sth = $this->db->query("SELECT * FROM news ORDER BY CreateDate DESC LIMIT $l");   
        }
        $sth->setFetchMode(PDO::FETCH_CLASS, 'News');
        /*return $sth->fetchAll();*/
        $news =  [];
        while($r = $sth->fetch()){
            $r->Image = $this->getNewImage($r->Id);
            $news[] = $r;
        }
        return $news;
    }
    
    public function getQuestions($l){
        $i = $this->db->query("SELECT count(*) as Count FROM questions")->fetch()['Count'];
        if($l == null || $l == 'null'){
            $sth = $this->db->query("SELECT * FROM questions ORDER BY Id DESC");
        }
        else{
            $sth = $this->db->query("SELECT * FROM questions ORDER BY Id DESC LIMIT $l");   
        }
        $sth->setFetchMode(PDO::FETCH_CLASS, 'BaseEntity');
        return array(Count => $i, Questions => $sth->fetchAll());
    }

    public function getApps($l, $p){
        if($this->checkAdmin($l, $p)){
            $sth = $this->db->query("SELECT * FROM apps");
            $sth->setFetchMode(PDO::FETCH_CLASS, 'App');
            return $sth->fetchAll();
        }else{
            return null;
        }
    }

    public function getDocs(){
        $sth = $this->db->query("SELECT * FROM docs");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Doc');
        return $sth->fetchAll();
    }
    
    public function getImportantDocs(){
        $sth = $this->db->query("SELECT * FROM docs WHERE IsImportant=1");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Doc');
        return $sth->fetchAll();
    }

    public function getTypeDocs($types){
        $types = "('".implode("','",$types)."')";
        $sth = $this->db->prepare("SELECT * FROM docs WHERE TypeId IN ".$types);
        $sth->execute(array($type));
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Doc');
        return $sth->fetchAll();
    }
    
    public function getDocTypes($info){
        $info = ($info === 'true' OR $info === true);
        if ($info){
            $sth = $this->db->prepare("SELECT * FROM doctypes WHERE Info=?");
            $sth->execute(array((bool)$info));
        }
        else{
            $sth = $this->db->query("SELECT * FROM doctypes");
        }
        $sth->setFetchMode(PDO::FETCH_CLASS, 'DocType');
        return $sth->fetchAll();
    }
    
    public function getProp($name){
        $sth = $this->db->prepare("SELECT * FROM props WHERE Name=? LIMIT 1");
        $sth->execute(array($name));
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Prop');
        return $sth->fetch();
    }

    public function getProps(){
        $sth = $this->db->query("SELECT * FROM props");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Prop');
        return $sth->fetchAll();
    }
    
    public function getContacts(){
        $sth = $this->db->query("SELECT * FROM contacts");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Contact');
        $contacts =  [];
        while($r = $sth->fetch()){
            $r->Phone = $this->getContact($r->Id, 'phone');
            $r->Email = $this->getContact($r->Id, 'email');
            $r->Address = $this->getContact($r->Id, 'address');
            $contacts[] = $r;
        }
        return $contacts;
    }
    
    public function getVacancies(){
        $sth = $this->db->query("SELECT * FROM vacancies");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Vacancy');
        $vacancies =  [];
        while($r = $sth->fetch()){
            $r->Duties = $this->getVacancy($r->Id, 'duty');
            $r->Requirements = $this->getVacancy($r->Id, 'requirement');
            $r->Conditions = $this->getVacancy($r->Id, 'condition');
            $vacancies[] = $r;
        }
        return $vacancies;
    }
    
    public function search($str){
        $search = [];
        $sth = $this->db->query("SELECT * FROM docs WHERE LOWER(Name) LIKE '%".strtolower($str)."%'");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Doc');
        $search[] = $sth->fetchAll();
        $sth = $this->db->query("SELECT * FROM pricetypes WHERE LOWER(Search) LIKE '%".strtolower($str)."%'");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Rate');
        $search[] = $sth->fetchAll();
        $sth = $this->db->query("SELECT * FROM news WHERE LOWER(Name) LIKE '%".strtolower($str)."%' OR LOWER(Description) LIKE '%".strtolower($str)."%'");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'News');
        $search[] = $sth->fetchAll();
        $sth = $this->db->query("SELECT * FROM contacts WHERE LOWER(Head) LIKE '%".strtolower($str)."%' OR LOWER(Boss) LIKE '%".strtolower($str)."%'");
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Contact');
        $contacts =  [];
        while($r = $sth->fetch()){
            $r->Phone = $this->getContact($r->Id, 'phone');
            $r->Email = $this->getContact($r->Id, 'email');
            $r->Address = $this->getContact($r->Id, 'address');
            $contacts[] = $r;
        }
        $search[] = $contacts;
        return $search;
    }
    private function getContact($id, $type){
        $sth = $this->db->prepare("SELECT * FROM contactvalues WHERE ContactId=? and Type=?");
        $sth->execute(array($id, $type));
        $sth->setFetchMode(PDO::FETCH_CLASS, 'ContactValue');
        $contacts = [];
        while($r = $sth->fetch()){
            $contacts[] = $r[3];
        }
        return $contacts;
    }
    
    private function getNewImage($id){
        $sth = $this->db->prepare("SELECT * FROM newsimages WHERE NewId=?");
        $sth->execute(array($id));
        $sth->setFetchMode(PDO::FETCH_CLASS, 'NewsImage');
        $images = [];
        while($r = $sth->fetch()){
            $images[] = $r[2];
        }
        return $images;
    }
    
    private function getVacancy($id, $type){
        $sth = $this->db->prepare("SELECT * FROM vacancyvalues WHERE VacancyId=? and Type=?");
        $sth->execute(array($id, $type));
        $sth->setFetchMode(PDO::FETCH_CLASS, 'VacancyValue');
        return $sth->fetchAll();
    }
    
    public function getRates($type){
        $sth = $this->db->prepare("SELECT * FROM pricetypes WHERE Type=?");
        $sth->execute(array($type));
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Rate');
        $rates =  [];
        while($r = $sth->fetch()){
            $r->Prices = $this->getPrices($r->Id);
            $rates[] = $r;
        }
        return $rates;
    }
    
    private function getPrices($id){
        $sth = $this->db->prepare("SELECT * FROM pricevalues WHERE PriceTypeId=?");
        $sth->execute(array($id));
        $sth->setFetchMode(PDO::FETCH_CLASS, 'Price');
        return $sth->fetchAll();
    }

    public function addApp($app){
        $res = $this->genInsertQuery($app,"apps");
        $s = $this->db->prepare($res[0]);
        if($res[1][0]!=null){
            $s->execute($res[1]);
            $tel = "Не указано";
            if($app['Phone']!=null){
                $tel=$app['Phone'];
            }
            $to = "marija.ilyinskaia@yandex.ru, lawyer2@vdknf.ru, volik9925@yandex.ru";
            $subject = $app['Topic'];
            $str = file_get_contents("appsMess.html");
            $str = str_replace ( '#name#' , $app['Name'], $str);
            $str = str_replace ( '#tel#' , $tel, $str);
            $str = str_replace ( '#text#' , $app['Description'], $str);
            $headers  = "Content-type: text/html; charset=utf-8 \r\n";
            $headers .= "From:".$app['Email']."\r\n";
            mail($to, $subject, $str, $headers);
        }
        return $this->db->lastInsertId();
    }

    public function addNews($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $images = $new['Image'];
            unset($new['Image']);
            $res = $this->genInsertQuery($new,"news");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
            $newId = $this->db->lastInsertId();
            $imgIds = $this->addImages($newId, $images);
            return array($newId, $imgIds);
        }else{
            return null;
        }
    }
    
    private function addImages($id, $images, $rm = false){
        if($rm and $images!=null){
            $this->removeNewImage($id);
        };
        for($i = 0; $i < count($images); $i++){
            $c = array(
            'NewId'=> $id
            );
            $res = $this->genInsertQuery($c,"newsimages");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
            $idses[] = $this->db->lastInsertId();
        }
        return $idses;
    }
    
    public function addQuestion($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $res = $this->genInsertQuery($new,"questions");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
            return $this->db->lastInsertId();
        }else{
            return null;
        }
    }
    
    public function addPrice($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $res = $this->genInsertQuery($new,"pricevalues");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
            return $this->db->lastInsertId();
        }else{
            return null;
        }
    }
    
    public function addContact($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $phones = $new['Phone'];
            $address = $new['Address'];
            $emails = $new['Email'];
            unset($new['Phone']);
            unset($new['Address']);
            unset($new['Email']);
            $res = $this->genInsertQuery($new,"contacts");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
            $id = $this->db->lastInsertId();
            $this->addContacts($phones, $emails, $address, $id);
            
            return $id;
            
        }else{
            return null;
        }
    }
    public function addVacancy($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $children = $new['AllConditions'];
            unset($new['AllConditions']);
            $res = $this->genInsertQuery($new,"vacancies");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
            $id = $this->db->lastInsertId();
            for($i = 0; $i<count($children); $i++){
                $c = $children[$i];
                $c['VacancyId'] = $id;
                $res = $this->genInsertQuery($c,"vacancyvalues");
                $s = $this->db->prepare($res[0]);
                if($res[1][0]!=null){
                    $s->execute($res[1]);
                }
            }
            
            return $id;
            
        }else{
            return null;
        }
    }
    
    public function updateVacancy($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $id = $new['Id'];
            unset($new['Id']);
            if(count($new['Types'])>0){
                $this->removeChildren($id, 'vacancyvalues', 'VacancyId', $new['Types']);
            }
            
            unset($new['Types']);
            for ($i = 0; $i < count($new['AllConditions']); $i++) {
                $new['AllConditions'][$i]['VacancyId'] = $id;
                $res = $this->genInsertQuery($new['AllConditions'][$i],"vacancyvalues");
                $s = $this->db->prepare($res[0]);
                if($res[1][0]!=null){
                    $s->execute($res[1]);
                }
            }
            unset($new['AllConditions']);
            $a = $this->genUpdateQuery(array_keys($new), array_values($new), "vacancies", $id);
            $s = $this->db->prepare($a[0]);
            $s->execute($a[1]);
            return $a;
        }else{
            return false;
        }
    }
    
    public function updateContact($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $id = $new['Id'];
            unset($new['Id']);
            $this->addContacts($new['Phone'], $new['Email'], $new['Address'], $id, true);
            unset($new['Phone']);
            unset($new['Address']);
            unset($new['Email']);
            $a = $this->genUpdateQuery(array_keys($new), array_values($new), "contacts", $id);
            $s = $this->db->prepare($a[0]);
            $s->execute($a[1]);
            return $a;
        }else{
            return false;
        }
    }
    private function removeContacts($id, $types = array('phone', 'email', 'address')){
        $types = "('".implode("','",$types)."')";
        $s = $this->db->prepare("DELETE FROM contactvalues WHERE ContactId=? AND Type IN ".$types);
        $s->execute(array($id));
    }
    
    private function removeNewImage($id){
        $s = $this->db->prepare("DELETE FROM newsimages WHERE NewId=?");
        $s->execute(array($id));
    }
    
    private function removeChildren($id, $table, $collumn, $types = array('phone', 'email', 'address')){
        $types = "('".implode("','",$types)."')";
        $s = $this->db->prepare("DELETE FROM $table WHERE $collumn=? AND Type IN ".$types);
        $s->execute(array($id));
    }
    
    private function addContacts($phones, $emails, $address, $id, $rm = false){
        if($rm){
            $types = [];
            if($phones != null){
                $types[]='phone';
            }
            if($emails != null){
                $types[]='email';
            }
            if($address != null){
                $types[]='address';
            }
            $this->removeContacts($id, $types);
        }
        
        
        for ($i = 0; $i < count($phones); $i++) {
            $c = array(
                'ContactId'=> $id,
                'Type'=> 'phone',
                'Value'=> $phones[$i]
                );
            $res = $this->genInsertQuery($c,"contactvalues");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
        }
        for ($i = 0; $i < count($emails); $i++) {
            $c = array(
                'ContactId'=> $id,
                'Type'=> 'email',
                'Value'=> $emails[$i]
                );
            $res = $this->genInsertQuery($c,"contactvalues");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
        }
        for ($i = 0; $i < count($address); $i++) {
            $c = array(
                'ContactId'=> $id,
                'Type'=> 'address',
                'Value'=> $address[$i]
                );
            $res = $this->genInsertQuery($c,"contactvalues");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
        }
    }
    
    public function addDoc($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $res = $this->genInsertQuery($new,"docs");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
            return $this->db->lastInsertId();
        }else{
            return null;
        }
    }
    
   public function addDocType($l, $p, $type){
        if($this->checkAdmin($l, $p)){
            $res = $this->genInsertQuery($type,"doctypes");
            $s = $this->db->prepare($res[0]);
            if($res[1][0]!=null){
                $s->execute($res[1]);
            }
            return $this->db->lastInsertId();
        }else{
            return null;
        }
    }
    
    public function updateDocType($l, $p, $type){
        if($this->checkAdmin($l, $p)){
            $id = $type['Id'];
            unset($type['Id']);
            $a = $this->genUpdateQuery(array_keys($type), array_values($type), "doctypes", $id);
            $s = $this->db->prepare($a[0]);
            $s->execute($a[1]);
            return true;
        }else{
            return false;
        }
    }
    
    public function getNewsById($id){
        $s = $this->db->prepare("SELECT * FROM news WHERE Id=?");
        $s->execute(array($id));
        return $s->fetch();
    }
    
    public function removeItem($l, $p, $id, $table){
        if($this->checkAdmin($l, $p)){
            $s = $this->db->prepare("DELETE FROM $table WHERE Id=?");
            $s->execute(array($id));
            return true;
        }else{
            return null;
        }
    }

    public function updateProp($l, $p, $id, $v){
        if($this->checkAdmin($l, $p)){
            
            $s = $this->db->prepare("UPDATE props SET Value=? WHERE Id=?");
            $s->execute(array($v, $id));
            return $this->db->lastInsertId();
        }else{
            return null;
        }
    }

    public function updateQuestion($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $id = $new['Id'];
            unset($new['Id']);
            $a = $this->genUpdateQuery(array_keys($new), array_values($new), "questions", $id);
            $s = $this->db->prepare($a[0]);
            $s->execute($a[1]);
            return $a;
        }else{
            return false;
        }
    }
    
    public function updatePrice($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $id = $new['Id'];
            unset($new['Id']);
            $a = $this->genUpdateQuery(array_keys($new), array_values($new), "pricevalues", $id);
            $s = $this->db->prepare($a[0]);
            $s->execute($a[1]);
            return $id;
        }else{
            return false;
        }
    }
    
    public function updateNews($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $id = $new['Id'];
            unset($new['Id']);
            $idses = $this->addImages($id, $new['Image'], true);
            unset($new['Image']);
            $a = $this->genUpdateQuery(array_keys($new), array_values($new), "news", $id);
            $s = $this->db->prepare($a[0]);
            $s->execute($a[1]);
            return $idses;
        }else{
            return false;
        }
    }
    
    public function updateDoc($l, $p, $new){
        if($this->checkAdmin($l, $p)){
            $id = $new['Id'];
            unset($new['Id']);
            $a = $this->genUpdateQuery(array_keys($new), array_values($new), "docs", $id);
            $s = $this->db->prepare($a[0]);
            $s->execute($a[1]);
            return true;
        }else{
            return false;
        }
    }
    
    public function removeNew($l, $p, $id, $images){
        if($this->checkAdmin($l, $p)){
            $s = $this->db->prepare('DELETE FROM news WHERE Id=?');
            $s->execute(array($id));
            $this->removeNewImage($id);
            for($i=0; $i<count($images); $i++){
                $this->removeFile($images[$i]);
            }
            return true;
        }else{
            return null;
        }
    }
    
    public function removeQuestion($l, $p, $id){
        if($this->checkAdmin($l, $p)){
            $s = $this->db->prepare('DELETE FROM questions WHERE Id=?');
            $s->execute(array($id));
            return true;
        }else{
            return null;
        }
    }

    public function enterAdmin($l, $p){
        
        return $this->checkAdmin($l, $p);
    }

    private function checkAdmin($l, $p){
        
        $access = file("user.php"); 
        $login = trim($access[1]); 
        $passw = trim($access[2]); 
        if($l==$login && $p==$passw){
            return true;
        }else{
            return false;
        }
    }
    
}
?>