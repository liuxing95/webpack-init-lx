import { helloworld } from './helloworld';
import { common } from  '../../common/index'

const result = common()
document.write(`${helloworld()}-- ${result}`);
