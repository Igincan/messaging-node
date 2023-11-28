--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: person_insert_trigger_function(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.person_insert_trigger_function() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF NEW.EMAIL = 'undefined' THEN
            NEW.EMAIL := NULL;
        END IF;
        RETURN NEW;
    END;
$$;


ALTER FUNCTION public.person_insert_trigger_function() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Group" (
    id integer NOT NULL,
    name character varying(25) NOT NULL
);


ALTER TABLE public."Group" OWNER TO postgres;

--
-- Name: Person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Person" (
    id integer NOT NULL,
    "groupId" integer NOT NULL,
    "firstName" character varying(50) NOT NULL,
    "lastName" character varying(50) NOT NULL,
    "phoneNumber" character(13) NOT NULL,
    email character varying(100)
);


ALTER TABLE public."Person" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    hash character(60) NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.groups_id_seq OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public."Group".id;


--
-- Name: people_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.people_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.people_id_seq OWNER TO postgres;

--
-- Name: people_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.people_id_seq OWNED BY public."Person".id;


--
-- Name: Group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group" ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: Person id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person" ALTER COLUMN id SET DEFAULT nextval('public.people_id_seq'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Group" (id, name) FROM stdin;
1	Workers
3	Admins
2	Civiliansaaa
\.


--
-- Data for Name: Person; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Person" (id, "groupId", "firstName", "lastName", "phoneNumber", email) FROM stdin;
3	3	Washington	Sanford	+421985454026	\N
4	3	Toni	Mcgowan	+421988155024	\N
5	1	Ernestine	Bradford	+421995556320	\N
7	1	Levine	Navarro	+421993451436	\N
8	2	Alyce	Nelson	+421984948334	\N
9	2	Britney	Moran	+421998843334	\N
10	3	Elvira	Oconnor	+421999956826	\N
11	1	Horton	Smith	+421980752527	\N
12	3	Ila	Wiley	+421999051420	\N
13	3	Joyce	Garcia	+421993860031	\N
14	2	Lacy	Lane	+421984559538	\N
15	2	Hess	Delaney	+421993552931	\N
16	1	Giles	Simmons	+421995051325	\N
17	3	Hewitt	Mccullough	+421998046837	\N
18	3	Hannah	Dale	+421996353629	\N
20	2	Duran	Flores	+421980655032	\N
22	1	Ursula	Welch	+421983041438	\N
23	2	Tran	Beard	+421996357732	\N
24	2	Sheryl	Goodwin	+421988341837	\N
25	2	Cunningham	Schneider	+421981245732	\N
26	2	Morales	Randolph	+421981442131	\N
27	1	Leigh	Rodgers	+421980548237	\N
28	2	Sparks	Mckay	+421992344620	\N
29	1	Russell	Witt	+421984553022	\N
31	1	Lora	Swanson	+421985450937	\N
32	1	Autumn	Obrien	+421993142532	\N
33	1	Shelia	Potter	+421987158931	\N
34	3	Eddie	Owen	+421994248930	\N
35	1	Tracy	Frye	+421986058326	\N
36	3	Colon	Hartman	+421987652636	\N
37	3	Rodgers	Gates	+421984848827	\N
38	2	Wiley	Zamora	+421989550831	\N
39	3	Johns	Good	+421985553829	\N
40	3	Lott	Horn	+421983240639	\N
41	3	Kristin	Gomez	+421989558539	\N
42	3	Molly	Norman	+421997552725	\N
43	2	Sharron	Weber	+421994559120	\N
44	2	Manuela	Merrill	+421993440424	\N
45	3	Swanson	Christian	+421986955127	\N
46	1	John	White	+421998950735	\N
47	2	Annette	Waters	+421990159638	\N
48	1	Roxanne	Hess	+421989358036	\N
49	1	Lawson	Noel	+421986150121	\N
50	3	Diaz	Madden	+421987852027	\N
51	2	Dale	Hammond	+421997256532	\N
52	3	Whitehead	Ramsey	+421990247126	\N
53	2	Yolanda	Hopkins	+421984557429	\N
54	2	Chrystal	Steele	+421985154025	\N
55	2	Gamble	Hogan	+421991158136	\N
56	3	Kim	Calhoun	+421987356833	\N
57	1	Patton	Roberts	+421980543932	\N
58	3	Chen	Rosa	+421986247838	\N
59	3	Riley	Gallegos	+421995055332	\N
61	2	Marek	Kramár	+421756334945	\N
2	2	Kamil	Pete	+421845321008	null
1	1	Jerrie	Mosley	+421982444421	null
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, hash) FROM stdin;
1	admin	$2b$10$jdqnnl8L0tzqfRhpJV6LWebohpRqUCIjH0HRDIK6lwe.BdbPknY7e
\.


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 5, true);


--
-- Name: people_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.people_id_seq', 63, true);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Group groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Group"
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: Person people_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);


--
-- Name: Person person_insert_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER person_insert_trigger BEFORE INSERT ON public."Person" FOR EACH ROW WHEN (((new.email)::text = 'undefined'::text)) EXECUTE FUNCTION public.person_insert_trigger_function();


--
-- Name: Person person_update_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER person_update_trigger BEFORE UPDATE ON public."Person" FOR EACH ROW WHEN (((new.email)::text = 'undefined'::text)) EXECUTE FUNCTION public.person_insert_trigger_function();


--
-- Name: Person people_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT people_group_id_fkey FOREIGN KEY ("groupId") REFERENCES public."Group"(id);


--
-- PostgreSQL database dump complete
--

