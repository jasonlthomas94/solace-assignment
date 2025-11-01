import db from "../../../db";
import { advocates } from "../../../db/schema";
import { and, ilike, or, sql, asc } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim() ?? "";

  // pagination
  const page = Math.max(parseInt(url.searchParams.get("page") ?? "1") || 1, 1);
  const pageSizeRaw =
    parseInt(
      url.searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE.toString()
    ) || DEFAULT_PAGE_SIZE;
  const pageSize = Math.max(pageSizeRaw, 1);
  const offset = (page - 1) * pageSize;

  // check for and build search filters
  const filters = [];
  if (search) {
    const s = `%${search}%`;
    filters.push(
      or(
        ilike(advocates.firstName, s),
        ilike(advocates.lastName, s),
        ilike(advocates.city, s),
        ilike(advocates.degree, s)
      )
    );
  }
  const whereExpr = filters.length ? and(...filters) : undefined;

  // data query
  const dataQuery = (
    whereExpr
      ? db.select().from(advocates).where(whereExpr)
      : db.select().from(advocates)
  )
    .orderBy(
      asc(advocates.lastName),
      asc(advocates.firstName),
      asc(advocates.id)
    )
    .limit(pageSize)
    .offset(offset);

  // count query
  const countAlias = sql<number>`cast(count(*) as int)`.as("count");
  const countQuery = whereExpr
    ? db.select({ count: countAlias }).from(advocates).where(whereExpr)
    : db.select({ count: countAlias }).from(advocates);

  const [rows, countRows] = await Promise.all([dataQuery, countQuery]);

  const total = Number(countRows[0]?.count ?? 0);
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return Response.json({
    data: rows,
    page,
    pageSize,
    total,
    totalPages,
  });
}
