import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MessageSquare, ChevronRight, Search, Check, Plus } from 'lucide-react';
import { ExperienceHeader, ExperienceSignature } from '../components/ExperienceLayout';
import { asset, Icon } from '../components/FarmUI';

const faqs = [
  { category: '미니팜 사용', question: '물은 어떻게 보충하나요?', answer: '제품의 물통을 열고 최대 수위선을 넘지 않게 물을 채운 뒤 제자리에 장착해 주세요. 실제 제품의 사용설명서를 우선 확인하세요. 팜이 상담에서 물 보충 과정을 체험할 수 있어요.', link: '/chat', label: '팜이에게 물어보기' },
  { category: '미니팜 사용', question: '온도와 조명은 어디서 조절하나요?', answer: '메뉴의 스마트 제어에서 온도·조명·급수·재배 모드·예약을 변경할 수 있어요. 버튼이 잠겨 있다면 잠금 탭에서 먼저 해제해 주세요. 이 화면은 실제 기기를 제어하지 않는 체험입니다.', link: '/control?tab=temperature', label: '스마트 제어 열기' },
  { category: '식물 키우기', question: '어떤 채소를 키울 수 있나요?', answer: '이 체험에서는 청경채·상추·루꼴라를 선택할 수 있어요. 미니팜 등록에서 채소를 고르면 상담과 스마트 제어의 재배 모드에도 반영돼요.', link: '/register', label: '키우는 채소 선택하기' },
  { category: '계정·문의', question: '로그인과 기기 등록은 어떻게 체험하나요?', answer: '로그인 화면에서 체험 계정 채우기를 누른 후 로그인하세요. 완료 화면에서 미니팜 이름과 채소를 등록할 수 있어요. 실제 계정이나 기기 연결은 필요하지 않아요.', link: '/login', label: '로그인 체험하기' },
  { category: '계정·문의', question: '문의 내역은 어디에 보관되나요?', answer: '이 데모에서 작성한 문의는 현재 브라우저 탭에만 보관되며 고객센터에 전송되지 않아요. 탭을 닫으면 사라질 수 있어요. 실제 상담은 전화 상담을 이용해 주세요. 비밀번호나 연락처 등 개인정보를 입력하지 마세요.' },
  { category: '식물 키우기', question: '팜이는 실제 식물 상태를 확인하나요?', answer: '미니팜 상태는 체험 데이터예요. 센서나 실제 제품을 조회하지 않아요. AI가 연결되지 않은 체험 모드는 정해진 안내를 제공하며, AI 연결 시에도 기기 데이터는 체험용이에요.', link: '/ai', label: '팜이 만나기' },
];
const storageKey = 'wells_demo_inquiries';
function readInquiries() {
  try {
    const records = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    return Array.isArray(records) ? records.filter(r => r && typeof r.id === 'string' && typeof r.title === 'string' && typeof r.body === 'string' && typeof r.date === 'string').slice(0, 20) : [];
  } catch { return []; }
}

export default function CustomerCenter() {
  return <section className="experience-page support-page">
    <ExperienceHeader title="고객센터" backTo="/" />
    <div className="support-content">
      <h2>어떤 도움이 필요하세요?</h2>
      <p className="experience-muted">자주 묻는 질문을 살펴보세요.</p>
      <div className="support-contact-cards">
        <a className="support-contact-card" href="tel:15884113"><div><h3>전화 상담</h3><p>웰스 고객센터로 문의해 주세요</p></div><Icon name="headset" size={43} /></a>
        <Link className="support-contact-card" to="/chat"><div><h3>상담톡 문의</h3><p>쉽고 간편한 궁금증 해결</p></div><span className="support-chat-icon"><Icon name="message" size={43} /></span></Link>
      </div>
      <nav className="support-links" aria-label="고객센터 메뉴">
        <Link to="/support/faq">자주 묻는 질문 (FAQ)<ChevronRight size={18} /></Link>
        <Link to="/support/inquiries">1:1 문의 / 내역 조회<ChevronRight size={18} /></Link>
      </nav>
      <Link className="support-fami-card" to="/ai"><div><strong>AI 팜이에게 상담하기</strong><span>무엇이든 편하게 물어보세요</span></div><img src={asset + 'fami.webp'} alt="정원 친구 팜이" /></Link>
    </div>
    <ExperienceSignature />
  </section>;
}

export function FAQ() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');
  const matches = faqs.filter(item => (category === '전체' || item.category === category) && `${item.question} ${item.answer}`.includes(query.trim()));
  return <section className="experience-page support-page">
    <ExperienceHeader title="자주 묻는 질문" backTo="/support" />
    <div className="support-detail-content">
      <h2>궁금한 점을 찾아보세요</h2>
      <label className="faq-search"><Search size={19} /><input aria-label="질문 검색" placeholder="물 보충, 온도, 로그인 검색" value={query} onChange={e => setQuery(e.target.value)} type="search" /></label>
      <div className="faq-categories" aria-label="질문 분류">{['전체', '미니팜 사용', '식물 키우기', '계정·문의'].map(label => <button key={label} aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</button>)}</div>
      <p className="experience-muted" role="status">{matches.length}개의 질문</p>
      <div className="faq-list">{matches.map(item => <details key={item.question}><summary>{item.question}<Plus size={18} /></summary><p>{item.answer}</p>{item.link && <Link to={item.link}>{item.label}<ChevronRight size={15} /></Link>}</details>)}</div>
      {!matches.length && <div className="support-empty"><p>검색 결과가 없어요.</p><button className="experience-outline" onClick={() => { setQuery(''); setCategory('전체'); }}>전체 질문 보기</button></div>}
      <Link className="experience-outline support-next" to="/support/inquiries">해결되지 않았나요? 문의 작성하기</Link>
    </div><ExperienceSignature />
  </section>;
}

export function Inquiries() {
  const [records, setRecords] = useState(readInquiries);
  const [view, setView] = useState('history');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('사용 방법');
  const [status, setStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const save = next => {
    setRecords(next);
    try { sessionStorage.setItem(storageKey, JSON.stringify(next)); return true; }
    catch { return false; }
  };
  const submit = event => {
    event.preventDefault();
    if (!title.trim() || !body.trim() || records.length >= 20) return;
    const persisted = save([{ id: crypto.randomUUID(), title: title.trim(), body: body.trim(), category, date: new Date().toISOString() }, ...records]);
    setTitle(''); setBody(''); setView('history');
    setStatus(persisted ? '이 탭에 문의를 저장했어요. 실제 고객센터에 접수되지는 않았어요.' : '화면에 문의를 보관했어요. 브라우저 저장소를 사용할 수 없어 새로고침하면 사라져요. 실제 접수되지 않았어요.');
  };
  return <section className="experience-page support-page">
    <ExperienceHeader title="1:1 문의 / 내역 조회" backTo="/support" />
    <div className="support-detail-content">
      <div className="inquiry-tabs" aria-label="문의 메뉴"><button aria-pressed={view === 'history'} onClick={() => setView('history')}>문의 내역 ({records.length})</button><button aria-pressed={view === 'write'} onClick={() => setView('write')}>문의 작성</button></div>
      <p className="support-demo-note">브라우저 체험용으로 현재 탭에만 보관돼요. 실제 접수되지 않으며 개인정보는 입력하지 마세요.</p>
      {status && <p className="support-status" role="status"><Check size={18} />{status}</p>}
      {view === 'write' ? <form className="inquiry-form" onSubmit={submit}>
        <label htmlFor="inquiry-category">문의 유형</label><select id="inquiry-category" value={category} onChange={e => setCategory(e.target.value)}>{['사용 방법', '식물 키우기', '기기 설정', '기타'].map(item => <option key={item}>{item}</option>)}</select>
        <label htmlFor="inquiry-title">제목</label><input id="inquiry-title" placeholder="궁금한 점을 짧게 적어주세요" value={title} onChange={e => setTitle(e.target.value)} maxLength={80} required />
        <label htmlFor="inquiry-body">문의 내용</label><textarea id="inquiry-body" placeholder="개인정보 없이 문의 내용을 입력해주세요" value={body} onChange={e => setBody(e.target.value)} maxLength={1500} rows={7} required /><span className="inquiry-count">{body.length} / 1500</span>
        {records.length >= 20 && <p role="alert">최대 20개까지 보관할 수 있어요. 이전 문의를 삭제해 주세요.</p>}
        <button className="experience-primary" disabled={!title.trim() || !body.trim() || records.length >= 20}>이 탭에 문의 저장하기</button>
      </form> : records.length ? <div className="inquiry-list">{records.map(record => <article key={record.id}><span className="inquiry-badge">체험 저장 · 미접수</span><details><summary>{record.title}</summary><p>{record.body}</p></details><small>{record.category} · {new Date(record.date).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</small>{deleteId === record.id ? <div className="inquiry-delete-confirm"><span>이 문의를 삭제할까요?</span><button onClick={() => { const persisted = save(records.filter(r => r.id !== record.id)); setDeleteId(null); setStatus(persisted ? '문의 내역을 삭제했어요.' : '화면에서 삭제했어요. 저장소 오류로 새로고침 후 다시 표시될 수 있어요.'); }}>삭제 확인</button><button onClick={() => setDeleteId(null)}>취소</button></div> : <button className="inquiry-delete" onClick={() => setDeleteId(record.id)}>삭제</button>}</article>)}</div> : <div className="support-empty"><MessageSquare size={34} /><h2>아직 작성한 문의가 없어요</h2><p>궁금한 점을 남겨보세요.</p><button className="experience-primary" onClick={() => setView('write')}>문의 작성하기</button></div>}
      <a className="support-real-contact" href="tel:15884113">실제 상담은 1588-4113으로 전화해 주세요<PhoneCall size={16} /></a>
    </div><ExperienceSignature />
  </section>;
}
