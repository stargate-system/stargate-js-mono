import {ServerStorage} from "./ServerStorage";
import fs from 'fs';
import path from "path";

const ROOT_DIR = 'ServerStorage';

const get = (directory: string, key: string) => {
    return new Promise<string | undefined>((resolve) => {
        if (validatePath(directory, key)) {
            const path = ROOT_DIR + '/' + directory + '/' + key;
            fs.readFile(path, (err, data) => {
                if (err) {
                    console.log('On getting from ServerStorage', err);
                    resolve(undefined);
                } else {
                    resolve(data.toString());
                }
            });
        } else {
            console.log('ServerStorage access denied for ' + directory + '/' + key);
            resolve(undefined);
        }
    });
};

const set = (directory: string, key: string, value: string) => {
    if (directory.length && key.length && value.length) {
        if (!validatePath(directory, key)) {
            console.log('ServerStorage access denied for ' + directory + '/' + key);
            return;
        }
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
        if (!validatePath(directory, key)) {
            console.log('ServerStorage access denied for ' + directory + '/' + key);
            return;
        }
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
    if (!validatePath(directory, key)) {
        console.log('ServerStorage access denied for ' + directory + '/' + (key ?? ''));
        return;
    }
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

const validatePath = (directory: string, key?: string) => {
    const requestedPath = path.normalize(ROOT_DIR + '/' + directory + '/' + (key ?? ''));
    return requestedPath.startsWith(ROOT_DIR);
}

const BasicServerStorage: ServerStorage = {
    get,
    set,
    append,
    remove
}

export default BasicServerStorage;
