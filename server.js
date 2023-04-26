  const os = require('os');
  const dir = os.tmpdir();
  const fs = require('fs');
  const express = require('express')
  const app = express()
  const port = 3000
  const bb = require('express-busboy');
const { exit } = require('process');
  	bb.extend(app, {
    		upload: true,
	});
  ////////////////////Route Public Html//////////////////////////
  app.use(express.static('public'))
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  ///////////////////////////////////////////////////////////////



  //////////////////////Route Api GET DIRECTORY//////////////////////////
  function listerRepertoireSync(repertoire) {
    let fichiers = fs.readdirSync(repertoire);
    let resultat = [];
    fichiers.forEach(function(fichier) {
      let stat = fs.statSync(repertoire + '/' + fichier);
      let element = {
        name: fichier,
        isFolder: stat.isDirectory()
      };
      if (!element.isFolder) {
        element.size = stat.size;
      }
      resultat.push(element);
    });
    return resultat;
  }

  app.get('/api/drive/:name?', function(req, res) {
    if (req.params.name) {
      let name = req.params.name;
      let path = dir + '/' + name;
      if (fs.existsSync(path)) {
        res.status(200).json(listerRepertoireSync(path));
      } else {
        res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      }
    } else {
      res.status(200).json(listerRepertoireSync(dir));
    }
  });
  //////////////////////////////////////////////////////////////

  //////////////////////Route Api POST CREATE//////////////////////////
  app.post('/api/drive', function(req, res) {
    let name = req.query.name;
    if (name.match(/^[a-z0-9]+$/i)) {
      let path = dir + '/' + name;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        res.status(200).json({ message: 'Le dossier a été créé avec succès' });
      } else {
        res.status(409).json({ error: 'Le dossier existe déjà' });
      }
    } else {
      res.status(400).json({ error: 'Le nom du dossier contient des caractères non-alphanumériques' });
    }
  });


  app.post('/api/drive/:folder', function(req, res) {
    let folder = req.params.folder;
    let name = req.query.name;
    if (name.match(/^[a-z0-9]+$/i)) {
      let path = dir + '/' + folder;
      if (!fs.existsSync(path)) {
        res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      } else {
        path = path + '/' + name;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
          res.status(201).json({ message: 'Le dossier a été créé avec succès' });
        } else {
          res.status(409).json({ error: 'Le dossier existe déjà' });
        }
      }
    } else {
      res.status(400).json({ error: 'Le nom du dossier contient des caractères non-alphanumériques' });
    }
  });
  //////////////////////////////////////////////////////////////


  //////////////////////Route Api DELETE//////////////////////////
  app.delete('/api/drive/:name', function(req, res) {
    let name = req.params.name;
    if (name.match(/^[a-z0-9]+$/i)) {
      let path = dir + '/' + name;
      if (fs.existsSync(path)) {
        fs.rmdirSync(path);
        res.status(200).json({ message: 'Le dossier a été supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      }
    } else {
      res.status(400).json({ error: 'Le nom du dossier contient des caractères non-alphanumériques' });
    }
  });



  app.delete('/api/drive/:folder/:name', function(req, res) {
    let folder = req.params.folder;
    let name = req.params.name;
    if (name.match(/^[a-z0-9]+$/i)) {
      let path = dir + '/' + folder + '/' + name;
      if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
        res.status(200).json({ message: 'Le dossier a été supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Le dossier demandé n\'existe pas' });
      }
    } else {
      res.status(400).json({ error: 'Le nom du dossier contient des caractères non-alphanumériques' });
    }
  });
  ///////////////////////////////UPLOAD/////////////////////////
  function checkFileName(fileName) {
    var regex = /^[a-zA-Z0-9]+$/;
    var fileWithoutExtension = fileName.split('.')[0];
    return regex.test(fileWithoutExtension);
  }


	app.put('/api/drive', function(req, res) {
  	let filename = req.files.file.filename;
    let filename_temp = req.files.file.file;
  	
    console.log(req);
  	if (filename && checkFileName(filename)) {
    		let filepath = dir + '/' + filename_temp;
    		if (!fs.existsSync(filepath)) {
          fs.copyFile(filename_temp, dir + '/' + filename, () => {
            console.log('Le fichier a été copié avec succès');
          });          
      			res.status(200).json({ message: 'Le fichier a été créé avec succès' });
    		} else {
      			res.status(409).json({ error: 'Le fichier existe déjà' });
    		}
  	} else {
    		res.status(400).json({ error: 'Le nom du fichier doit être alphanumérique' });
  	}
	});
  
  //////////////////////////////////////////////////////////////
