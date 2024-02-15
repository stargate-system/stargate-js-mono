import {ServerStorage} from "./ServerStorage";
import fs from 'fs';

const ROOT_DIR = './ServerStorage';

const get = (directory: string, key: string) => {
    return new Promise<string | undefined>((resolve) => {
        const path = ROOT_DIR + '/' + directory + '/' + key;
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log('On getting from ServerStorage', err);
                resolve(undefined);
            } else {
                resolve(data.toString());
            }
        });
    });
};

const set = (directory: string, key: string, value: string) => {
    if (directory.length && key.length && value.length) {
        const path = ROOT_DIR + '/' + directory;
        fs.promises.mkdir(path, {recursive: true}).then(() => {
            fs.writeFile(path + '/' + key, value, (err) => {
                if (err) {
                    console.log('On setting to ServerStorage', err);
                }
            });
        }).catch(console.log);
    }
};

const append = (directory: string, key: string, value: string) => {
    if (directory.length && key.length && value.length) {
        const path = ROOT_DIR + '/' + directory + '/' + key;
        const file = fs.createWriteStream(path, {flags: 'a'});
        file.on('error', (err) => {
            fs.lstat(path, (statErr, stats) => {
                if (statErr && !stats) {
                    set(directory, key, value);
                } else {
                    console.log('On appending to ServerStorage', err);
                }
            });
        });
        file.on('ready', () => {
            file.write(value);
            file.close();
        });
    }
}

const remove = (directory: string, key?: string, logError?: boolean) => {
    if (key === undefined) {
        fs.rm(ROOT_DIR + '/' + directory, {recursive: true}, (err) => {
            if (err && logError) {
                console.log('On removing directory from ServerStorage', err);
            }
        });
    } else {
        fs.rm(ROOT_DIR + '/' + directory + '/' + key, (err) => {
            if (err && logError) {
                console.log('On removing key from ServerStorage', err);
            }
        });
    }
};

const BasicServerStorage: ServerStorage = {
    get,
    set,
    append,
    remove
}

export default BasicServerStorage;
