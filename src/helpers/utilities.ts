import { Observable } from 'rxjs';
import axios from 'axios';

const httpRequest$ = (url: string, method: string, headers = {}, data = null) =>
  new Observable((observer) => {
    const request = {
      method,
      url,
      headers,
      data,
    };

    axios(request)
      .then((response) => {
        observer.next(response.data);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });

function filterData(data: any) {
  const hash = process.env.HASH || null;
  const { items } = data;
  return items.map((raw: any) => {
    const { videoId, topLevelComment } = raw.snippet;
    const filterTopLevelComment: TopLevelComment = topLevelComment;

    const dataRawBefore = {
      comment: filterTopLevelComment.snippet.textOriginal,
      author: filterTopLevelComment.snippet.authorDisplayName,
      authorChannelUrl: filterTopLevelComment.snippet.authorChannelUrl,
      video: videoId,
    };
    // return (dataRawBefore.author === name) ? dataRawBefore : null;
    return dataRawBefore.comment.includes(hash) ? dataRawBefore : null;
  });
}

function otherPage(raw:any):string | null{
    //nextPageToken
    if(raw && raw.nextPageToken){
      return `Existe más comentarios... 👉 ${raw.nextPageToken}`
    }
    return 'No hay más comentarios'
}

export { httpRequest$, filterData, otherPage };

interface Snippet {
  topLevelComment: any;
  videoId: string;
}

interface TopLevelComment {
  snippet: any;
}
