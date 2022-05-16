import saveGoogle from './controllers/google.spread';
import {
  catchError,
  map,
  mergeMap,
  of,
  tap,
  Observable,
  firstValueFrom,
} from 'rxjs';
import { filterData, httpRequest$, otherPage } from '../src/helpers/utilities';
import { Request, Response } from 'express';

async function callComment(req: Request, res: Response) {
  try {
    const { pageToken } = req.query;

    let dataRaw: any;
    const video = process.env.VIDEO || '';
    const hash: string = process.env.HASH || '';
    const url = [
      `https://youtube.googleapis.com/youtube/v3/commentThreads?`,
      `part=snippet&searchTerms=${encodeURIComponent(hash)}&videoId=${video}`,
      `&maxResults=100`,
      `&alt=json&prettyPrint=true`,
      `&key=${process.env.API_GOOGLE}`,
      pageToken ? `&pageToken=${pageToken}` : '',
    ].join('');


    console.log(url);

    const mainCall$ = httpRequest$(url, 'get');

    const results$ = mainCall$.pipe(
      tap((data) => {
        dataRaw = data;
      }),
      map((data) => filterData(data)),
      map((data) => data.filter((datum: any) => datum)),
      tap((data) => saveGoogle(data)),
      catchError((val) => of(`${val}`))
    );

    await firstValueFrom(results$);
    res.send({ msg: otherPage(dataRaw) });
  } catch (e) {
    console.log(e)
    res.status(500);
    res.send({ msg: 'Error', });
  }
}

export default callComment;
